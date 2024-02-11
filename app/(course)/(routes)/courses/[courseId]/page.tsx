import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { db } from '@/lib/db';

type CourseIdPageProps = {
  params: { courseId: string };
};

const CourseIdPage = async ({ params }: CourseIdPageProps) => {
  const user = await getCurrentUser();

  const course = await db.course.findUnique({
    where: { id: params.courseId },
    include: {
      chapters: {
        where: { isPublished: true },
        include: { userProgress: { where: { userId: user?.userId } } },
        orderBy: { position: 'asc' },
      },
    },
  });

  if (!course) {
    redirect('/');
  }

  const chapterId =
    course.chapters.find((chapter) => !chapter?.userProgress?.[0]?.isCompleted)?.id ||
    course.chapters[0].id;

  return redirect(`/courses/${params.courseId}/chapters/${chapterId}`);
};

export default CourseIdPage;
