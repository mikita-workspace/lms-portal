'use client';

import { Fee } from '@prisma/client';
import { useTranslations } from 'next-intl';

import { getCourses } from '@/actions/courses/get-courses';
import { getGroupedCourseList } from '@/lib/course';
import { cn } from '@/lib/utils';

import { CourseCard } from './course-card';

type CoursesListProps = {
  fees?: Fee[];
  items: Awaited<ReturnType<typeof getCourses>>;
};

export const CoursesList = ({ fees, items }: CoursesListProps) => {
  const t = useTranslations('courses.list');

  const groupedCourseList = getGroupedCourseList(items);

  return (
    <>
      {Object.keys(groupedCourseList).map((key, idx) => (
        <div key={key}>
          <h2 className={cn(idx > 0 && 'mt-8', 'text-xl font-semibold mb-4')}>
            {groupedCourseList[key][0].category?.name}
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
            {groupedCourseList[key].map((item) => (
              <CourseCard
                category={item?.category?.name}
                chaptersLength={item._count.chapters}
                customRates={item.customRates}
                fees={fees}
                id={item.id}
                imagePlaceholder={item.imagePlaceholder}
                imageUrl={item.imageUrl}
                isPremium={item?.isPremium}
                isPublished={item.isPublished}
                isPurchased={Boolean(item?._count?.purchases)}
                key={item.id}
                price={item.price}
                progress={item.progress}
                title={item.title}
              />
            ))}
          </div>
        </div>
      ))}
      {!items.length && (
        <div className="text-center text-sm text-muted-foreground mt-10">{t('notFound')}</div>
      )}
    </>
  );
};
