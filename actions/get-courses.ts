'use server';

import { Category, Course } from '@prisma/client';

import { db } from '@/lib/db';

import { getProgress } from './get-progress';

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCourses = { userId?: string; title?: string; categoryId?: string };

export const getCourses = async ({ userId, title, categoryId }: GetCourses) => {
  const courses = await db.course.findMany({
    where: { isPublished: true, title: { contains: title }, categoryId },
    include: {
      category: true,
      chapters: { where: { isPublished: true }, select: { id: true } },
      ...(userId && { purchases: { where: { userId } } }),
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
