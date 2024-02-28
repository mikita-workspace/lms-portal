'use server';

import { Category, Chapter, Course, Purchase } from '@prisma/client';

import { db } from '@/lib/db';

import { getProgress } from './get-progress';

type CourseWithProgressAndCategory = Course & {
  category: Category;
  chapters: Chapter[];
  price: number | null;
  progress: number | null;
  purchases?: Purchase[];
};

export const getDashboardCourses = async (userId: string) => {
  const purchasedCourses = await db.purchase.findMany({
    where: { userId },
    select: {
      course: {
        include: { category: true, chapters: { where: { isPublished: true } } },
      },
    },
  });

  if (!purchasedCourses) {
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }

  const courses = purchasedCourses.map(
    (purchase) => purchase.course,
  ) as CourseWithProgressAndCategory[];

  for (const course of courses) {
    const progress = await getProgress({ userId, courseId: course.id });

    course['progress'] = progress;
  }

  const completedCourses = courses.filter((course) => course.progress === 100);
  const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100);

  return {
    completedCourses,
    coursesInProgress,
  };
};
