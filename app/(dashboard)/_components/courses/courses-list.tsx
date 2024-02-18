'use client';

import { getCourses } from '@/actions/db/get-courses';
import { useCurrentLocale } from '@/hooks/use-current-locale';

import { CourseCard } from './course-card';

type CoursesListProps = {
  items: Awaited<ReturnType<typeof getCourses>>;
};

export const CoursesList = ({ items }: CoursesListProps) => {
  const currentLocale = useCurrentLocale();

  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <CourseCard
            category={item?.category?.name}
            chaptersLength={item.chapters.length}
            currentLocale={currentLocale}
            id={item.id}
            imageUrl={item.imageUrl}
            isPublished={item.isPublished}
            key={item.id}
            prices={item.price}
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
