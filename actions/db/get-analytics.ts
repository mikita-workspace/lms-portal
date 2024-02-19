'use server';

import { Course, Purchase, PurchaseDetails, User } from '@prisma/client';

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
        course: {
          include: { price: true },
        },
        details: true,
      },
    });

    const users = await db.user.findMany();

    const groupedEarnings = groupByCourse(purchases, users);

    const totalRevenue = Object.values(groupedEarnings)
      .flat()
      .map((item) => item.details)
      .reduce<Record<string, number>>((total, { currency, price }) => {
        if (currency && price) {
          total[currency] = (total[currency] ?? 0) + price;
        }

        return total;
      }, {});

    const lastPurchases = purchases.slice(0, 5).map((ps) => ({
      courseTitle: ps.course.title,
      timestamp: ps.updatedAt,
      user: users.find((user) => user.id === ps.userId),
    }));

    const totalSales = purchases.length;

    return {
      totalRevenue,
      lastPurchases,
      totalSales,
    };
  } catch (error) {
    console.error('[GET_CHAPTER_ACTION]', error);

    return {
      lastPurchases: [],
      totalRevenue: {},
      totalSales: 0,
    };
  }
};
