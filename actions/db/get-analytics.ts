'use server';

import { Course, Purchase } from '@prisma/client';

import { db } from '@/lib/db';

type PurchaseWithCourse = Purchase & { course: Course };

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {};

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;

    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }

    // TODO
    // grouped[courseTitle] += purchase.course.price!;
    grouped[courseTitle] += 0;
  });

  return grouped;
};

export const getAnalytics = async (userId: string) => {
  const purchases = await db.purchase.findMany({
    where: { course: { userId } },
    include: { course: true },
  });

  if (!purchases) {
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }

  const groupedEarnings = groupByCourse(purchases);

  const data = Object.entries(groupedEarnings).map(([courseTitle, total]) => ({
    title: courseTitle,
    total,
  }));

  const totalRevenue = data.reduce((total, current) => total + current.total, 0);
  const totalSales = purchases.length;

  return {
    data,
    totalRevenue,
    totalSales,
  };
};
