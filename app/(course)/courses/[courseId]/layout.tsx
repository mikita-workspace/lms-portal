import { redirect } from 'next/navigation';
import React from 'react';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getProgress } from '@/actions/get-progress';
import { db } from '@/lib/db';

import { CourseSidebar } from './_components/course-sidebar/course-sidebar';

type CourseLayoutProps = Readonly<{
  children: React.ReactNode;
  params: { courseId: string };
}>;

const CourseLayout = async ({ children, params }: CourseLayoutProps) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/');
  }

  const course = await db.course.findUnique({
    where: { id: params.courseId },
    include: {
      chapters: {
        where: { isPublished: true },
        include: { userProgress: { where: { userId: user.userId } } },
        orderBy: { position: 'asc' },
      },
    },
  });

  if (!course) {
    redirect('/');
  }

  const progressCount = await getProgress({ userId: user.userId, courseId: course.id });

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50"></div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default CourseLayout;
