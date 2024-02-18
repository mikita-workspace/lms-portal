'use server';

import { Course, Price, Purchase, User } from '@prisma/client';

import { db } from '@/lib/db';

type PurchaseWithCourse = Purchase & { course: Course & { price: Price | null } };

const groupByCourse = (purchases: PurchaseWithCourse[], users: User[]) => {
  const grouped: { [courseTitle: string]: { user?: User; price: Price }[] } = {};

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;

    if (!grouped[courseTitle]) {
      grouped[courseTitle] = [];
    }

    const price = purchase.course.price;

    if (price) {
      grouped[courseTitle].push({ user: users.find((user) => user.id === purchase.userId), price });
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
      },
    });

    const users = await db.user.findMany();

    const groupedEarnings = groupByCourse(purchases, users);

    const data = Object.entries(groupedEarnings).map(([courseTitle, userPurchases]) => ({
      title: courseTitle,
      purchases: userPurchases,
    }));

    const lastPurchases = purchases.slice(0, 5).map((ps) => ({
      ...ps,
      user: users.find((user) => user.id === ps.userId),
    }));

    const totalSales = purchases.length;

    return {
      data,
      lastPurchases,
      totalSales,
    };
  } catch (error) {
    console.error('[GET_CHAPTER_ACTION]', error);

    return {
      data: [],
      lastPurchases: [],
      totalSales: 0,
    };
  }
};
