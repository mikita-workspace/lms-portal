import { Chapter, Course, UserProgress } from '@prisma/client';

import { NavBarRoutes } from '@/components/navbar/navbar-routes';

import { CourseNobileSideBar } from '../course-sidebar/course-sidebar-mobile';

type CourseNavBarProps = {
  course: Course & { chapters: (Chapter & { userProgress: UserProgress[] | null })[] };
  globalProgress?: {
    progressPercentage: number;
    total: number;
    value: number;
  } | null;
  progressCount: number;
};

export const CourseNavBar = ({ course, globalProgress, progressCount }: CourseNavBarProps) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white dark:bg-neutral-800 shadow-sm">
      <CourseNobileSideBar course={course} progressCount={progressCount} />
      <NavBarRoutes globalProgress={globalProgress} />
    </div>
  );
};
