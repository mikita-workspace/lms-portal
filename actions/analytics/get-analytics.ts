'use server';

import { Course, Fee, Purchase, PurchaseDetails, User } from '@prisma/client';
import { getUnixTime } from 'date-fns';
import groupBy from 'lodash.groupby';
import Stripe from 'stripe';

import { ONE_HOUR_SEC } from '@/constants/common';
import { CalculationMethod, FeeType } from '@/constants/fees';
import { DEFAULT_CURRENCY } from '@/constants/locale';
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

  return {
    fee: feeAmount,
    feeDetails,
    net: totalRevenue - feeAmount,
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
      available: balance?.available ?? [],
      pending: balance?.pending ?? [],
    },
    country: account.country,
    created: account.created,
    currency: account.default_currency,
    email: account.email,
    externalAccounts: account.external_accounts,
    id: account.id,
    metadata: account.metadata,
    type: account.type,
  };
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

    const stripeCharges = (
      await Promise.all(
        stripeCustomerIds.map(async (sc) => {
          const data = await fetchCachedData(
            `${userId}-${sc.stripeCustomerId}`,
            async () => {
              const res = await stripe.charges.list({ customer: sc.stripeCustomerId });

              return res.data;
            },
            ONE_HOUR_SEC,
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
          ONE_HOUR_SEC,
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
    const totalProfit = getTotalProfit(stripeBalanceTransactions, totalRevenue, fees);
    const transactions = getTransactions(stripeCharges, purchases, users);
    const stripeConnect = getStripeConnect(stripeAccount, stripeAccountBalance);

    return {
      chart,
      map,
      stripeConnect,
      totalProfit,
      totalRevenue,
      transactions,
    };
  } catch (error) {
    console.error('[GET_ANALYTICS_ACTION]', error);

    return {
      chart: [],
      map: [],
      stripeConnect: null,
      totalProfit: null,
      totalRevenue: 0,
      transactions: [] as Transaction[],
    };
  }
};
