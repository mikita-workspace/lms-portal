import { Chapter, Course, UserProgress } from '@prisma/client';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { db } from '@/lib/db';

import { CourseSideBarItem } from './course-sidebar-item';

type CourseSidebarProps = {
  course: Course & { chapters: (Chapter & { userProgress: UserProgress[] | null })[] };
  progressCount: number;
};

export const CourseSidebar = async ({ course, progressCount }: CourseSidebarProps) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/');
  }

  const purchase = await db.purchase.findUnique({
    where: { userId_courseId: { userId: user.userId, courseId: course.id } },
  });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
        {/* TODO: Check purchase and progress */}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSideBarItem
            key={chapter.id}
            courseId={course.id}
            id={chapter.id}
            isCompleted={Boolean(chapter.userProgress?.[0]?.isCompleted)}
            isLocked={!chapter.isFree && !purchase}
            label={chapter.title}
          />
        ))}
      </div>
    </div>
  );
};
