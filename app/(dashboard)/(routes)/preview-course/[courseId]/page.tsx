import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getPreviewCourse } from '@/actions/courses/get-preview-course';
import { AuthRedirect } from '@/components/auth/auth-redirect';
import { CourseEnrollButton } from '@/components/common/course-enroll-button';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import { cn } from '@/lib/utils';

import { ContinueButton } from './_components/continue-button';
import { PreviewDescription } from './_components/preview-description';
import { PreviewVideoPlayer } from './_components/preview-video-player';

type PreviewCourseIdPageProps = {
  params: { courseId: string };
};

export const generateMetadata = async ({ params }: PreviewCourseIdPageProps): Promise<Metadata> => {
  const course = await db.course.findUnique({
    where: { id: params.courseId },
  });

  return {
    title: course?.title || 'Nova Academy',
    description: course?.description || 'Educational portal',
  };
};

const PreviewCourseIdPage = async ({ params }: PreviewCourseIdPageProps) => {
  const t = await getTranslations('courses.preview');

  const user = await getCurrentUser();

  const { chapterImagePlaceholder, course, fees, hasPurchase } = await getPreviewCourse({
    courseId: params.courseId,
    userId: user?.userId,
  });

  if (!course || (course?.isPremium && !user?.hasSubscription)) {
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
            {t('backTo')}
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="space-y-6 md:col-span-3">
          {course.chapters?.[0]?.imageUrl && (
            <div className="relative aspect-w-16 aspect-h-9 border">
              <Image
                alt="Image"
                blurDataURL={chapterImagePlaceholder}
                fill
                src={course.chapters[0].imageUrl}
              />
            </div>
          )}
          {course.chapters?.[0]?.videoUrl && (
            <PreviewVideoPlayer
              videoUrl={course.chapters[0].videoUrl}
              isLocked={!course.chapters?.[0]?.isFree}
            />
          )}
          <PreviewDescription
            author={course?.user?.name}
            categories={[course.category!.name]}
            chaptersLength={course._count.chapters}
            customRates={course.customRates}
            customTags={course.customTags}
            description={course.description!}
            fees={fees}
            hasPurchase={hasPurchase}
            id={course.id}
            language={course.language}
            lastUpdate={course.updatedAt}
            price={course.price}
            title={course.title}
          />
        </div>
        <div className="space-y-6 md:col-span-2">
          <div
            className={cn(
              'w-full border rounded-lg p-6',
              user?.userId &&
                'bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%',
              !user?.userId && 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
            )}
          >
            <div className="mb-8 space-y-2 text-white">
              <h4 className="font-semibold text-xl">{t('readyToLearn')}</h4>
              <p className="text-sm">{t('keepProgress')}</p>
            </div>
            <div className="w-full">
              {user?.userId ? (
                <>
                  {!hasPurchase && (
                    <CourseEnrollButton
                      courseId={params.courseId}
                      customRates={course.customRates}
                      price={course.price}
                      variant="outline"
                    />
                  )}
                  {hasPurchase && <ContinueButton redirectUrl={`/courses/${params.courseId}`} />}
                </>
              ) : (
                <AuthRedirect>
                  <Button className="w-full truncate" variant="outline">
                    {t('loginToContinue')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </AuthRedirect>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewCourseIdPage;
