import { Chapter, Course, UserProgress } from '@prisma/client';
import { Menu } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { CourseSideBar } from './course-sidebar';

type CourseMobileSideBarProps = {
  course: Course & { chapters: (Chapter & { userProgress: UserProgress[] | null })[] };
  progressCount: number;
};

export const CourseMobileSideBar = ({ course, progressCount }: CourseMobileSideBarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition duration-300">
        <Menu />
      </SheetTrigger>
      <SheetContent className="p-0 bg-white w-72" side="left">
        <CourseSideBar course={course} progressCount={progressCount} />
      </SheetContent>
    </Sheet>
  );
};
