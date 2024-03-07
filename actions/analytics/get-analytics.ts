'use server';

import { Course, Fee, PayoutRequest, Purchase, PurchaseDetails, User } from '@prisma/client';
import { getUnixTime } from 'date-fns';
import groupBy from 'lodash.groupby';
import Stripe from 'stripe';

import { ONE_MINUTE_SEC } from '@/constants/common';
import { CalculationMethod, FeeType } from '@/constants/fees';
import { DEFAULT_CURRENCY } from '@/constants/locale';
import { PayoutRequestStatus } from '@/constants/payments';
import { fetchCachedData } from '@/lib/cache';
import { db } from '@/lib/db';
import { getCalculatedFee } from '@/lib/fees';
import { stripe } from '@/server/stripe';

type PurchaseWithCourse = Purchase & { course: Course } & { details: PurchaseDetails | null };
type Sales = (ReturnType<typeof groupByCourse>[number][number]['details'] & { title: string })[];
type Transaction = {
  amount: number;
  billingDetails: Stripe.Charge.BillingDetails;
  currency: string;
  id: string;
  paymentMethod: {
    brand?: string | null;
    country?: string | null;
    expMonth?: number | null;
    expYear?: number | null;
    last4?: string | null;
  } | null;
  purchaseDate: number;
  receiptUrl: string | null;
  title: string;
};
type StripeConnectPayouts = ReturnType<typeof getStripeConnectPayouts>;

const groupByCourse = (purchases: PurchaseWithCourse[], users: User[]) => {
  const grouped: { [courseTitle: string]: { user?: User; details: PurchaseDetails }[] } = {};

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;

    if (!grouped[courseTitle]) {
      grouped[courseTitle] = [];
    }

    if (purchase.details) {
      grouped[courseTitle].push({
        user: users.find((user) => user.id === purchase.userId),
        details: purchase.details,
      });
    }
  });

  return grouped;
};

const getMap = (sales: Sales) => {
  const groupedByPosition = groupBy(
    sales,
    (item: (typeof sales)[number]) => `${item.latitude}*${item.longitude}`,
  );

  return Object.keys(groupedByPosition).map((key) => {
    const [lt, lg] = key.split('*');
    return {
      city: groupedByPosition[key][0].city,
      country: groupedByPosition[key][0].country,
      currency: groupedByPosition[key][0].currency,
      position: [Number(lt), Number(lg)],
      totalAmount: groupedByPosition[key].reduce(
        (total, current) => total + (current.price ?? 0),
        0,
      ),
      totalSales: groupedByPosition[key].length,
    };
  });
};

const getTotalProfit = (
  stripeBalanceTransactions: Record<string, any>[],
  totalRevenue: number,
  fees: Fee[],
  successfulPayouts: Pick<PayoutRequest, 'amount' | 'currency'>[],
) => {
  const totalFees = stripeBalanceTransactions
    .reduce<ReturnType<typeof getCalculatedFee>[]>((totalFees, current) => {
      const calculatedFees = fees.map((fee) => getCalculatedFee(current.amount, fee));
      const stripeDiff = Math.abs(
        current.fee -
          calculatedFees.reduce(
            (acc, current) => acc + (current.type === FeeType.STRIPE ? current.amount : 0),
            0,
          ),
      );

      const stripeProcessingFee = calculatedFees.find(
        (fee) => fee.method === CalculationMethod.PERCENTAGE && fee.type === FeeType.STRIPE,
      );

      return [
        ...totalFees,
        ...calculatedFees,
        ...(stripeProcessingFee
          ? [
              {
                amount: Math.round(stripeDiff),
                id: stripeProcessingFee.id,
                method: stripeProcessingFee.method,
                name: stripeProcessingFee.name,
                quantity: 1,
                type: stripeProcessingFee.type,
              },
            ]
          : []),
      ];
    }, [])
    .flat();

  const groupedFeesByName = groupBy(totalFees, (item) => item.name);

  const feeDetails = Object.keys(groupedFeesByName).map((key) => ({
    name: key,
    amount: groupedFeesByName[key].reduce((total, current) => total + current.amount, 0),
  }));

  const feeAmount = feeDetails.reduce((amount, current) => amount + current.amount, 0);
  const net = totalRevenue - feeAmount;
  const availableForPayout =
    net - successfulPayouts.reduce((acc, current) => acc + current.amount, 0);

  return {
    availableForPayout,
    fee: feeAmount,
    feeDetails,
    net,
    total: totalRevenue,
  };
};

const getTransactions = (
  charges: Stripe.Response<Stripe.ApiList<Stripe.Charge>>['data'],
  purchases: PurchaseWithCourse[],
  users: User[],
) => {
  const userCharges = charges.reduce<Transaction[]>((userCharges, ch) => {
    const purchaseWithPaymentIntent = purchases.find(
      (pc) => pc.details?.paymentIntent === ch.payment_intent,
    );

    if (purchaseWithPaymentIntent) {
      userCharges.push({
        amount: ch.amount,
        billingDetails: ch.billing_details,
        currency: ch.currency,
        id: ch.id,
        paymentMethod: {
          brand: ch.payment_method_details?.card?.brand,
          country: ch.payment_method_details?.card?.country,
          expMonth: ch.payment_method_details?.card?.exp_month,
          expYear: ch.payment_method_details?.card?.exp_year,
          last4: ch.payment_method_details?.card?.last4,
        },
        purchaseDate: ch.created,
        receiptUrl: ch.receipt_url,
        title: purchaseWithPaymentIntent.course.title,
      });
    }

    return userCharges;
  }, []);

  const userFreePurchases = purchases.reduce<Transaction[]>((userFreePurchases, pc) => {
    const user = users.find((user) => user.id === pc.userId);

    if (pc.details?.price === 0) {
      userFreePurchases.push({
        amount: 0,
        billingDetails: {
          name: user?.name ?? null,
          address: null,
          email: user?.email ?? null,
          phone: null,
        },
        currency: DEFAULT_CURRENCY,
        id: pc.id,
        paymentMethod: null,
        purchaseDate: getUnixTime(pc.createdAt),
        receiptUrl: null,
        title: pc.course.title,
      });
    }

    return userFreePurchases;
  }, []);
  return [...userCharges, ...userFreePurchases].sort((a, b) => b.purchaseDate - a.purchaseDate);
};

const getStripeConnect = (
  account: Stripe.Response<Stripe.Account> | null,
  balance: Stripe.Response<Stripe.Balance> | null,
) => {
  if (!account) {
    return null;
  }

  return {
    balance: {
      available: balance?.available?.reduce((acc, current) => acc + current.amount, 0) ?? 0,
      pending: balance?.pending?.reduce((acc, current) => acc + current.amount, 0) ?? 0,
    },
    country: account.country,
    created: account.created,
    currency: account.default_currency,
    email: account.email,
    externalAccounts: account.external_accounts,
    id: account.id,
    isActive: account.details_submitted,
    metadata: account.metadata,
    payouts: account.settings?.payouts,
    type: account.type,
  };
};

const getStripeConnectPayouts = (
  payouts: Stripe.Response<Stripe.ApiList<Stripe.BalanceTransaction>> | null,
  declinedPayouts: PayoutRequest[],
) => {
  const stripePayouts =
    payouts?.data?.map((py) => ({
      amount: py.amount,
      created: py.created,
      currency: py.currency,
      fee: py.fee,
      id: py.id,
      net: py.net,
      status: py.status,
      type: py.type,
    })) ?? [];

  const declined = declinedPayouts.map((dp) => ({
    amount: dp.amount,
    created: getUnixTime(dp.updatedAt),
    currency: dp.currency,
    fee: 0,
    id: dp.id,
    net: dp.amount,
    status: dp.status,
    type: 'Request',
  }));

  return [...stripePayouts, ...declined].sort((a, b) => b.created - a.created);
};

export const getAnalytics = async (userId: string) => {
  try {
    const purchases = await db.purchase.findMany({
      where: { course: { userId } },
      orderBy: { updatedAt: 'desc' },
      include: {
        course: true,
        details: true,
      },
    });

    const userIds = [...new Set(purchases.map((ps) => ps.userId))];
    const users = await db.user.findMany({ where: { id: { in: userIds } } });

    const stripeAccountId = await db.stripeConnectAccount.findUnique({ where: { userId } });

    const stripeCustomerIds = await db.stripeCustomer.findMany({
      where: { userId: { in: userIds } },
      select: { stripeCustomerId: true },
    });

    const stripeAccount = stripeAccountId?.stripeAccountId
      ? await stripe.accounts.retrieve(stripeAccountId.stripeAccountId)
      : null;

    const stripeAccountBalance = stripeAccountId?.stripeAccountId
      ? await stripe.balance.retrieve({ stripeAccount: stripeAccountId?.stripeAccountId })
      : null;

    const stripeAccountBalanceTransactions = stripeAccount?.id
      ? await stripe.balanceTransactions.list({ limit: 5 }, { stripeAccount: stripeAccount.id })
      : null;

    const payouts = stripeAccount?.id
      ? await db.payoutRequest.findMany({
          where: {
            connectAccount: { stripeAccountId: stripeAccount.id },
          },
          select: {
            amount: true,
            currency: true,
            id: true,
            status: true,
            transactionId: true,
            updatedAt: true,
          },
          orderBy: {
            updatedAt: 'desc',
          },
        })
      : [];

    const activePayouts = payouts.filter((py) => py.status === PayoutRequestStatus.PENDING);
    const declinedPayouts = payouts
      .filter((py) => py.status === PayoutRequestStatus.DECLINED)
      .slice(0, 5);
    const successfulPayouts = payouts
      .filter((py) => py.status === PayoutRequestStatus.PAID)
      .slice(0, 5);

    const stripeCharges = (
      await Promise.all(
        stripeCustomerIds.map(async (sc) => {
          const data = await fetchCachedData(
            `${userId}-${sc.stripeCustomerId}`,
            async () => {
              const res = await stripe.charges.list({ customer: sc.stripeCustomerId });

              return res.data.filter((ch) =>
                purchases.find((pc) => pc.details?.paymentIntent === ch.payment_intent),
              );
            },
            ONE_MINUTE_SEC,
          );

          return data;
        }),
      )
    ).flat();

    const stripeBalanceTransactions = await Promise.all(
      stripeCharges.map(async (sc) => {
        const data = await fetchCachedData(
          `${userId}-${sc.id}`,
          async () => {
            const res = await stripe.balanceTransactions.retrieve(sc.balance_transaction);

            return res;
          },
          ONE_MINUTE_SEC,
        );

        return data;
      }),
    );

    const fees = await db.fee.findMany();

    const groupedEarnings = groupByCourse(purchases, users);
    const sales = Object.entries(groupedEarnings).flatMap(([title, others]) =>
      others.map((other) => ({ ...other.details, title })),
    );

    const chart = Object.entries(groupedEarnings).map(([title, others]) => ({
      title,
      qty: others.length,
    }));
    const map = getMap(sales);
    const totalRevenue = stripeBalanceTransactions.reduce(
      (revenue, current) => revenue + current.amount,
      0,
    );
    const totalProfit = getTotalProfit(
      stripeBalanceTransactions,
      totalRevenue,
      fees,
      successfulPayouts,
    );
    const transactions = getTransactions(stripeCharges, purchases, users);
    const stripeConnect = getStripeConnect(stripeAccount, stripeAccountBalance);
    const stripeConnectPayouts = getStripeConnectPayouts(
      stripeAccountBalanceTransactions,
      declinedPayouts as PayoutRequest[],
    );

    return {
      activePayouts,
      chart,
      map,
      stripeConnect,
      stripeConnectPayouts,
      totalProfit,
      totalRevenue,
      transactions,
    };
  } catch (error) {
    console.error('[GET_ANALYTICS_ACTION]', error);

    return {
      activePayouts: [] as PayoutRequest[],
      chart: [],
      map: [],
      stripeConnect: null,
      stripeConnectPayouts: [] as StripeConnectPayouts,
      totalProfit: null,
      totalRevenue: 0,
      transactions: [] as Transaction[],
    };
  }
};
