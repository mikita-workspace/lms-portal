import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { db } from '@/lib/db';

import { PreviewVideoPlayer } from './_components/preview-video-player';

type LandingCourseIdPageProps = {
  params: { courseId: string };
};

const LandingCourseIdPage = async ({ params }: LandingCourseIdPageProps) => {
  const user = await getCurrentUser();

  const course = await db.course.findUnique({
    where: { id: params.courseId },
    include: {
      chapters: {
        where: { isPublished: true, isFree: true, position: 1 },
        orderBy: { position: 'asc' },
      },
    },
  });

  if (!course) {
    redirect('/');
  }

  if (user) {
    redirect(`/courses/${params.courseId}`);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            className="flex items-center text-sm hover:opacity-75 transition duration-300 mb-6"
            href={'/'}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to courses
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <PreviewVideoPlayer videoUrl={course.chapters[0].videoUrl} />
          <div>Description</div>
        </div>
        <div className="space-y-6">
          <div>Enroll button</div>
          <div>External links</div>
        </div>
      </div>
    </div>
  );
};

export default LandingCourseIdPage;
