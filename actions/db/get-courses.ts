'use server';

import { Category, Course, Price } from '@prisma/client';

import { db } from '@/lib/db';

import { getProgress } from './get-progress';

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  price: Price | null;
  progress: number | null;
};

type GetCourses = { userId?: string; title?: string; categoryId?: string };

export const getCourses = async ({ userId, title, categoryId }: GetCourses) => {
  const courses = await db.course.findMany({
    where: { isPublished: true, title: { contains: title, lte: 'insensitive' }, categoryId },
    include: {
      ...(userId && { purchases: { where: { userId } } }),
      category: true,
      chapters: { where: { isPublished: true }, select: { id: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const courseWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
    courses.map(async (course) => {
      if (!course?.purchases?.length || !userId) {
        return {
          ...course,
          progress: null,
        };
      }

      const progressPercentage = await getProgress({ userId, courseId: course.id });

      return { ...course, progress: progressPercentage };
    }),
  );

  return courseWithProgress;
};
