'use client';

import { Fee } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { MdWorkspacePremium } from 'react-icons/md';

import { getCourses } from '@/actions/courses/get-courses';
import { getGroupedCourseList } from '@/lib/course';
import { cn } from '@/lib/utils';

import { CourseCard } from './course-card';

type CoursesListProps = {
  fees?: Fee[];
  items: Awaited<ReturnType<typeof getCourses>>;
  specificFilter?: boolean;
};

export const CoursesList = ({ fees, items, specificFilter }: CoursesListProps) => {
  const t = useTranslations('courses.list');

  const groupedCourseList = getGroupedCourseList(items, specificFilter);

  return (
    <>
      {Object.keys(groupedCourseList).map((key, index) => {
        const items = groupedCourseList[key];
        const isPremium = items[0].isPremium;
        const title = isPremium ? t(`labels.${key}`) : items[0].category?.name;

        return (
          <div key={key}>
            {title && (
              <div className={cn(index > 0 && 'mt-8', 'flex gap-x-2 items-center mb-4')}>
                {specificFilter && isPremium && (
                  <MdWorkspacePremium className="w-6 h-6 text-yellow-300" />
                )}
                <h2 className="text-xl font-semibold">{title}</h2>
              </div>
            )}
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
              {items.map((item) => (
                <CourseCard
                  {...item}
                  category={item?.category?.name}
                  chaptersLength={item._count.chapters}
                  fees={fees}
                  isPurchased={Boolean(item?._count?.purchases)}
                  key={item.id}
                />
              ))}
            </div>
          </div>
        );
      })}
      {!items.length && (
        <div className="text-center text-sm text-muted-foreground mt-10">{t('notFound')}</div>
      )}
    </>
  );
};
