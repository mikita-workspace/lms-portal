'use client';

import { Chapter, Course } from '@prisma/client';
import { Clock9 } from 'lucide-react';

import { CourseEnrollButton } from '@/components/common/course-enroll-button';
import { formatTimeInSeconds } from '@/lib/date';

import { CourseProgressButton } from './course-progress-button';

type ChapterTitleProps = {
  chapter: Chapter;
  chapterId: string;
  course: Course;
  courseId: string;
  durationInSec: number;
  hasPurchase: boolean;
  isCompleted?: boolean;
  nextChapterId?: string;
};

export const ChapterTitle = ({
  chapter,
  chapterId,
  course,
  courseId,
  durationInSec,
  hasPurchase,
  isCompleted,
  nextChapterId,
}: ChapterTitleProps) => {
  return (
    <div className="p-4 flex flex-col md:flex-row items-center justify-between">
      <div className="flex flex-col justify-center">
        <h2 className="text-2xl font-semibold mb-4 md:mb-0">{chapter.title}</h2>
        {durationInSec > 0 && (
          <div className="flex items-center gap-x-1 text-neutral-500 my-1">
            <Clock9 className="h-4 w-4" />
            <span className="text-xs">{formatTimeInSeconds(durationInSec)}</span>
          </div>
        )}
      </div>
      {hasPurchase ? (
        <CourseProgressButton
          chapterId={chapterId}
          courseId={courseId}
          isCompleted={isCompleted}
          nextChapterId={nextChapterId}
        />
      ) : (
        <div className="w-full md:w-auto">
          <CourseEnrollButton
            courseId={courseId}
            customRates={course.customRates}
            price={course.price}
          />
        </div>
      )}
    </div>
  );
};
