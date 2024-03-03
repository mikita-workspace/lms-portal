'use server';

import { Course, Fee, Purchase, PurchaseDetails, User } from '@prisma/client';
import groupBy from 'lodash.groupby';

import { ONE_HOUR_SEC } from '@/constants/common';
import { CalculationMethod } from '@/constants/fees';
import { fetchCachedData } from '@/lib/cache';
import { db } from '@/lib/db';
import { stripe } from '@/server/stripe';

type PurchaseWithCourse = Purchase & { course: Course } & { details: PurchaseDetails | null };

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

const getCalculatedServiceFee = (price: number, fee: Fee) => {
  let amount = 0;

  if (fee.method === CalculationMethod.FIXED) {
    amount = fee.amount;
  }

  if (fee.method === CalculationMethod.PERCENTAGE) {
    amount = (price * fee.rate) / 100;
  }

  return {
    amount: Math.round(amount),
    id: fee.id,
    name: fee.name,
    quantity: 1,
  };
};

type Sales = (ReturnType<typeof groupByCourse>[number][number]['details'] & { title: string })[];

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
  serviceFeeDetails: Fee | null,
) => {
  const totalFees = stripeBalanceTransactions
    .reduce((totalFees, current) => {
      const stripeFees = current.fee_details.map((fee: Record<string, string | number>) => ({
        amount: fee.amount,
        id: `${current.id}-${fee.amount}`,
        name: fee.description,
        quantity: 1,
      }));

      const serviceFee = serviceFeeDetails
        ? getCalculatedServiceFee(current.amount, serviceFeeDetails)
        : {};

      totalFees.push([...stripeFees, serviceFee]);

      return totalFees;
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

    const stripeCustomerIds = await db.stripeCustomer.findMany({
      where: { userId: { in: userIds } },
      select: { stripeCustomerId: true },
    });

    const stripeCharges = (
      await Promise.all(
        stripeCustomerIds.map(async (sc) => {
          const data = await fetchCachedData(
            `customerId-${sc.stripeCustomerId}`,
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
          `chargeId-${sc.id}`,
          async () => {
            const res = await stripe.balanceTransactions.retrieve(sc.balance_transaction);

            return res;
          },
          ONE_HOUR_SEC,
        );

        return data;
      }),
    );

    const serviceFeeDetails = await db.fee.findUnique({ where: { name: 'Nova LMS Service Fee' } });

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
    const totalProfit = getTotalProfit(stripeBalanceTransactions, totalRevenue, serviceFeeDetails);

    return {
      chart,
      map,
      totalProfit,
      totalRevenue,
    };
  } catch (error) {
    console.error('[GET_ANALYTICS_ACTION]', error);

    return {
      chart: [],
      map: [],
      totalProfit: null,
      totalRevenue: 0,
    };
  }
};
