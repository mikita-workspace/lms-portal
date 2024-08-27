import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getChapter } from '@/actions/courses/get-chapter';
import { Banner } from '@/components/common/banner';
import { CourseEnrollButton } from '@/components/common/course-enroll-button';
import { FileDownload } from '@/components/common/file-download';
import { Preview } from '@/components/common/preview';
import { Separator } from '@/components/ui/separator';

import { ChapterVideoPlayer } from './_components/chapter-video-player';
import { CourseProgressButton } from './_components/course-progress-button';

type ChapterIdPageProps = {
  params: { courseId: string; chapterId: string };
};

const ChapterIdPage = async ({ params }: ChapterIdPageProps) => {
  const t = await getTranslations('courses');

  const user = await getCurrentUser();

  const { chapter, course, muxData, attachments, nextChapter, userProgress, purchase } =
    await getChapter({
      chapterId: params.chapterId,
      courseId: params.courseId,
      userId: user!.userId,
    });

  if (!chapter || !course) {
    return redirect('/');
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = Boolean(purchase) && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && <Banner label={t('banner.completed')} variant="success" />}
      {isLocked && <Banner label={t('banner.lock')} variant="warning" />}
      <div className="flex flex-col max-w4xl mx-auto pb-20">
        <div className="p-4">
          <ChapterVideoPlayer
            chapterId={params.chapterId}
            completeOnEnd={completeOnEnd}
            courseId={params.courseId}
            isLocked={isLocked}
            nextChapterId={nextChapter?.id}
            videoUrl={muxData?.videoUrl}
          />
        </div>
        <div className="p-4 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-2xl font-semibold mb-4 md:mb-0">{chapter.title}</h2>
          {purchase ? (
            <CourseProgressButton
              chapterId={params.chapterId}
              courseId={params.courseId}
              isCompleted={Boolean(userProgress?.isCompleted)}
              nextChapterId={nextChapter?.id}
            />
          ) : (
            <div className="w-full md:w-auto">
              <CourseEnrollButton
                courseId={params.courseId}
                customRates={course.customRates}
                price={course.price}
              />
            </div>
          )}
        </div>
        {!isLocked && chapter.description && (
          <>
            <Separator />
            <Preview value={chapter.description} />
          </>
        )}
        {Boolean(attachments.length) && (
          <>
            <Separator />
            <div className="p-4">
              {attachments.map(({ id, url, name: fileName }) => (
                <FileDownload key={id} fileName={fileName} url={url} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChapterIdPage;
