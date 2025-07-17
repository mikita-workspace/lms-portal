'use server';

import { format, parseISO } from 'date-fns';

import { CHAPTER_XP } from '@/constants/courses';

import { getDashboardCourses } from '../courses/get-dashboard-courses';

export const getTimeMetric = async (userId: string) => {
  try {
    const courses = await getDashboardCourses({ userId, includeChapter: true });

    const allChapters = courses.filterCourses.flatMap((course) => course.chapters);
    const finishedChapters = courses.filterCourses
      .flatMap((course) => course.validChapters)
      .map((chapter) => ({
        ...chapter,
        durationSec: allChapters.find(({ id }) => chapter.chapterId === id)?.durationSec ?? 0,
      }));

    const groupedChapters = finishedChapters.reduce(
      (acc, progress) => {
        const chapter = allChapters.find((c) => c.id === progress.chapterId);
        if (!chapter) return acc;

        const date =
          typeof progress.updatedAt === 'string'
            ? parseISO(progress.updatedAt)
            : progress.updatedAt;
        const dateKey = format(date, 'yyyy-MM');

        if (!acc[dateKey]) {
          acc[dateKey] = {
            chapters: [],
            count: 0,
            date,
            totalSpentTimeInSec: 0,
            xp: 0,
          };
        }

        acc[dateKey].count += 1;
        acc[dateKey].totalSpentTimeInSec += chapter.durationSec ?? 0;
        acc[dateKey].xp += CHAPTER_XP;
        acc[dateKey].chapters.push({
          id: chapter.id,
          title: chapter.title,
          description: chapter.description,
        });

        return acc;
      },
      {} as Record<
        string,
        {
          chapters: { id: string; title: string; description: string | null }[];
          count: number;
          date: Date;
          totalSpentTimeInSec: number;
          xp: number;
        }
      >,
    );

    const totalSpentTimeInSec = Object.values(groupedChapters).reduce(
      (acc, current) => acc + current.totalSpentTimeInSec,
      0,
    );

    return { totalSpentTimeInSec, heatMap: groupedChapters };
  } catch (error) {
    console.error('[GET_TIME_METRIC]', error);

    return { totalSpentTimeInSec: 0, heatMap: {} };
  }
};
