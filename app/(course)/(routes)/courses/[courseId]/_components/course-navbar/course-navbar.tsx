import { Chapter, Course, Notification, UserProgress } from '@prisma/client';

import { NavBarRoutes } from '@/components/navbar/navbar-routes';

import { CourseMobileSideBar } from '../course-sidebar/course-sidebar-mobile';

type CourseNavBarProps = {
  course: Course & { chapters: (Chapter & { userProgress: UserProgress[] | null })[] };
  globalProgress?: {
    progressPercentage: number;
    total: number;
    value: number;
  } | null;
  progressCount: number;
  userNotifications?: Omit<Notification, 'userId'>[];
};

export const CourseNavBar = ({
  course,
  globalProgress,
  progressCount,
  userNotifications,
}: CourseNavBarProps) => {
  return (
    <div className="p-4 border-b h-full flex items-center justify-between md:justify-end bg-white dark:bg-neutral-800 shadow-sm">
      <CourseMobileSideBar course={course} progressCount={progressCount} />
      <NavBarRoutes globalProgress={globalProgress} userNotifications={userNotifications} />
    </div>
  );
};
