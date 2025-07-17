import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getChapter } from '@/actions/courses/get-chapter';
import { Banner } from '@/components/common/banner';
import { FileDownload } from '@/components/common/file-download';
import { Preview } from '@/components/common/preview';
import { Separator } from '@/components/ui/separator';

import { ChapterTitle } from './_components/chapter-title';
import { ChapterVideoPlayer } from './_components/chapter-video-player';

type ChapterIdPageProps = {
  params: Promise<{ courseId: string; chapterId: string }>;
};

const ChapterIdPage = async (props: ChapterIdPageProps) => {
  const { chapterId, courseId } = await props.params;
  const t = await getTranslations('courses');

  const user = await getCurrentUser();

  const {
    attachments,
    chapter,
    chapterImagePlaceholder,
    course,
    language,
    muxData,
    nextChapter,
    purchase,
    userProgress,
  } = await getChapter({
    chapterId,
    courseId,
    userId: user!.userId,
  });

  if (!chapter || !course) {
    return redirect('/');
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = Boolean(purchase) && !userProgress?.isCompleted;
  const durationInSec = chapter.durationSec ?? 0;

  return (
    <div>
      {userProgress?.isCompleted && <Banner label={t('banner.completed')} variant="success" />}
      {isLocked && <Banner label={t('banner.lock')} variant="warning" />}
      <div className="flex flex-col max-w4xl mx-auto pb-20">
        <div className="p-4">
          {chapter?.videoUrl && (
            <ChapterVideoPlayer
              chapterId={chapterId}
              completeOnEnd={completeOnEnd}
              courseId={courseId}
              isLocked={isLocked}
              nextChapterId={nextChapter?.id}
              videoUrl={muxData?.videoUrl}
            />
          )}
          {chapter?.imageUrl && muxData?.videoUrl && (
            <div className="relative aspect-w-16 aspect-h-9 border">
              <Image
                alt="Image"
                blurDataURL={chapterImagePlaceholder}
                fill
                src={muxData.videoUrl}
              />
            </div>
          )}
        </div>
        <ChapterTitle
          chapter={chapter}
          chapterId={chapterId}
          course={course}
          courseId={courseId}
          durationInSec={durationInSec}
          hasPurchase={Boolean(purchase)}
          isCompleted={Boolean(userProgress?.isCompleted)}
          nextChapterId={nextChapter?.id}
        />
        {!isLocked && chapter.description && (
          <>
            <Separator />
            <Preview
              enableTranslate
              id={chapter.id}
              language={language}
              value={chapter.description}
            />
          </>
        )}
        {Boolean(attachments.length) && (
          <>
            <Separator />
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 p-4">
              {attachments.map(({ id, url, name: fileName }) => (
                <FileDownload key={id} fileName={fileName} url={url} showDownloadButton />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChapterIdPage;
