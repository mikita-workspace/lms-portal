'use server';

import { Category, Course } from '@prisma/client';

import { FilterStatus } from '@/constants/courses';
import { db } from '@/lib/db';
import { getImagePlaceHolder } from '@/lib/image';

import { getProgress } from './get-progress';

type CourseWithProgressAndCategory = Course & {
  _count: { chapters: number };
  category: Category;
  imagePlaceholder: string;
  price: number | null;
  progress: number | null;
};

export const getDashboardCourses = async (userId: string, filter: string | null) => {
  const purchasedCourses = await db.purchase.findMany({
    where: { userId },
    select: {
      course: {
        include: {
          _count: { select: { chapters: { where: { isPublished: true } } } },
          category: true,
        },
      },
    },
  });

  if (!purchasedCourses) {
    return {
      completedCourses: [],
      coursesInProgress: [],
      filterCourses: [],
    };
  }

  const courses = purchasedCourses
    .map((purchase) => purchase.course)
    .filter((course) => course.isPublished) as CourseWithProgressAndCategory[];

  for (const course of courses) {
    const progress = await getProgress({ userId, courseId: course.id });
    const imagePlaceholder = await getImagePlaceHolder(course.imageUrl!);

    course['progress'] = progress;
    course['imagePlaceholder'] = imagePlaceholder.base64;
  }

  const completedCourses = courses.filter((course) => course.progress === 100);
  const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100);

  const filterCourses = (() => {
    if (filter === FilterStatus.PROGRESS) {
      return coursesInProgress;
    }

    if (filter === FilterStatus.COMPLETED) {
      return completedCourses;
    }

    return [...coursesInProgress, ...completedCourses];
  })();

  return {
    completedCourses,
    coursesInProgress,
    filterCourses,
  };
};
