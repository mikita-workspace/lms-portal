import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { LoginButton } from '@/components/auth/login-button';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';

import { PreviewDescription } from './_components/preview-description';
import { PreviewVideoPlayer } from './_components/preview-video-player';

type LandingCourseIdPageProps = {
  params: { courseId: string };
};

export const generateMetadata = async ({ params }: LandingCourseIdPageProps): Promise<Metadata> => {
  const course = await db.course.findUnique({
    where: { id: params.courseId },
  });

  return {
    title: course?.title || 'Nova LMS',
    description: course?.description || 'LMS Portal for educational purposes',
  };
};

const LandingCourseIdPage = async ({ params }: LandingCourseIdPageProps) => {
  const user = await getCurrentUser();

  if (user) {
    redirect(`/courses/${params.courseId}`);
  }

  const course = await db.course.findUnique({
    where: { id: params.courseId },
    include: {
      category: true,
      chapters: {
        where: { isPublished: true },
        orderBy: { position: 'asc' },
      },
    },
  });

  if (!course) {
    redirect('/');
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="space-y-6 md:col-span-3">
          <PreviewVideoPlayer
            videoUrl={course.chapters?.[0]?.videoUrl}
            isLocked={!course.chapters?.[0]?.isFree}
          />
          <PreviewDescription
            categories={[course.category!.name]}
            chaptersLength={course.chapters.length}
            description={course.description!}
            price={course.price}
            title={course.title}
          />
        </div>
        <div className="space-y-6 md:col-span-2">
          <div className="w-full border rounded-lg p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="mb-8 space-y-2 text-white">
              <h4 className="font-semibold text-xl">Ready to start learning?</h4>
              <p className="text-sm">
                Keep track of your progress, learn new things and much more.
              </p>
            </div>
            <div className="w-full">
              <LoginButton>
                <Button className="w-full" variant="outline">
                  Login to continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </LoginButton>
            </div>
          </div>
          {/* TODO: External recourses */}
          {/* <div className="w-full flex space-x-4"></div> */}
        </div>
      </div>
    </div>
  );
};

export default LandingCourseIdPage;
