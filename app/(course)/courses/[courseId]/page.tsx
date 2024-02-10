import { redirect } from 'next/navigation';

import { db } from '@/lib/db';

type CourseIdPageProps = {
  params: { courseId: string };
};

const CourseIdPage = async ({ params }: CourseIdPageProps) => {
  const course = await db.course.findUnique({
    where: { id: params.courseId },
    include: { chapters: { where: { isPublished: true }, orderBy: { position: 'asc' } } },
  });

  if (!course) {
    redirect('/');
  }

  //TODO: Create course landing page
  // return <div>{params.courseId}</div>;

  return redirect(`/courses/${params.courseId}/chapters/${course.chapters[0].id}`);
};

export default CourseIdPage;
