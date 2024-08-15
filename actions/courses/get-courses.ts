'use server';

import { Category, Course, Purchase } from '@prisma/client';

import { db } from '@/lib/db';
import { getImagePlaceHolder } from '@/lib/image';

import { getProgress } from './get-progress';

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  imagePlaceholder: string;
  price: number | null;
  progress: number | null;
  purchases?: Purchase[];
};

type GetCourses = {
  categoryId?: string;
  hasSubscription?: boolean;
  title?: string;
  userId?: string;
};

export const getCourses = async ({ categoryId, hasSubscription, title, userId }: GetCourses) => {
  const courses = await db.course.findMany({
    where: {
      ...(!hasSubscription && { isPremium: false }),
      categoryId,
      isPublished: true,
      title: { contains: title, mode: 'insensitive' },
    },
    include: {
      ...(userId && { purchases: { where: { userId } } }),
      category: true,
      chapters: { where: { isPublished: true }, select: { id: true } },
    },
    orderBy: [{ isPremium: 'desc' }, { createdAt: 'desc' }],
  });

  const courseWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
    courses.map(async (course) => {
      const imagePlaceholder = await getImagePlaceHolder(course.imageUrl!);

      if (!course?.purchases?.length || !userId) {
        return {
          ...course,
          imagePlaceholder: imagePlaceholder.base64,
          progress: null,
        };
      }

      const progressPercentage = await getProgress({ userId, courseId: course.id });

      return { ...course, imagePlaceholder: imagePlaceholder.base64, progress: progressPercentage };
    }),
  );

  return courseWithProgress;
};
