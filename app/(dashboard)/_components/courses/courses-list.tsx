'use client';

import { Fee } from '@prisma/client';

import { getCourses } from '@/actions/courses/get-courses';

import { CourseCard } from './course-card';

type CoursesListProps = {
  fees?: Fee[];
  items: Awaited<ReturnType<typeof getCourses>>;
};

export const CoursesList = ({ fees, items }: CoursesListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <CourseCard
            category={item?.category?.name}
            chaptersLength={item.chapters.length}
            customRates={item.customRates}
            fees={fees}
            id={item.id}
            imagePlaceholder={item.imagePlaceholder}
            imageUrl={item.imageUrl}
            isPremium={item?.isPremium}
            isPublished={item.isPublished}
            isPurchased={Boolean(item?.purchases?.length)}
            key={item.id}
            price={item.price}
            progress={item.progress}
            title={item.title}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">No courses found</div>
      )}
    </div>
  );
};
