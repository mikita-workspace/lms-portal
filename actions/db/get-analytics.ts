'use server';

import { Course, Purchase, PurchaseDetails, User } from '@prisma/client';
import groupBy from 'lodash.groupby';

import { db } from '@/lib/db';

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

    const users = await db.user.findMany();

    const groupedEarnings = groupByCourse(purchases, users);
    const sales = Object.entries(groupedEarnings).flatMap(([title, others]) =>
      others.map((other) => ({ ...other.details, title })),
    );

    const groupedByCity = groupBy(
      sales,
      (item: (typeof sales)[number]) => `${item.country}-${item.city}`,
    );
    const groupedByTitle = groupBy(sales, 'title');
    const uniqCurrencies = Array.from(new Set(sales.map(({ currency }) => currency)));
    const groupedByPosition = groupBy(
      sales,
      (item: (typeof sales)[number]) => `${item.latitude}*${item.longitude}`,
    );

    const totalRevenue = sales.reduce<Record<string, number>>((total, { currency, price }) => {
      if (currency && price) {
        total[currency] = (total[currency] ?? 0) + price;
      }

      return total;
    }, {});

    const lastPurchases = purchases.map((ps) => ({
      courseTitle: ps.course.title,
      timestamp: ps.updatedAt,
      user: users.find((user) => user.id === ps.userId),
    }));

    const totalSales = sales.length;

    const topSales = Object.keys(groupedByCity)
      .map((key) => {
        const item = groupedByCity[key];
        return {
          currency: item[0].currency,
          key,
          position: [item[0].latitude, item[0].longitude],
          sales: item.length,
          totalPrice: item.reduce((acc, current) => acc + (current.price ?? 0), 0),
        };
      })
      .sort((a, b) => b.sales - a.sales);

    const data = Object.keys(groupedByTitle).map((key) => {
      const items = groupedByTitle[key];
      const groupedByCurrency = groupBy(items, 'currency');

      return {
        name: key,
        ...Object.keys(groupedByCurrency).reduce<Record<string, number>>((acc, key) => {
          const price = groupedByCurrency[key].reduce(
            (total, current) => total + (current.price ?? 0),
            0,
          );

          acc[key] = acc[key] ?? 0 + price;

          uniqCurrencies.forEach((curr) => {
            if (curr) {
              acc[curr] = acc[curr] ?? 0;
            }
          });

          return acc;
        }, {}),
      };
    });

    const map = Object.keys(groupedByPosition).map((key) => {
      const [lt, lg] = key.split('*');

      return {
        city: groupedByPosition[key][0].city,
        country: groupedByPosition[key][0].country,
        currency: groupedByPosition[key][0].currency,
        position: [Number(lt), Number(lg)],
        total: groupedByPosition[key].reduce((total, current) => total + (current.price ?? 0), 0),
      };
    });

    return {
      data,
      lastPurchases,
      map,
      topSales,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.error('[GET_ANALYTICS_ACTION]', error);

    return {
      data: [],
      lastPurchases: [],
      map: [],
      topSales: [],
      totalRevenue: {},
      totalSales: 0,
    };
  }
};
