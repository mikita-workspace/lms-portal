import { File } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getChapter } from '@/actions/db/get-chapter';
import { Banner } from '@/components/common/banner';
import { Preview } from '@/components/common/preview';
import { Separator } from '@/components/ui/separator';

import { ChapterVideoPlayer } from './_components/chapter-video-player';
import { CourseEnrollButton } from './_components/course-enroll-button';
import { CourseProgressButton } from './_components/course-progress-button';

type ChapterIdPageProps = {
  params: { courseId: string; chapterId: string };
};

const ChapterIdPage = async ({ params }: ChapterIdPageProps) => {
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
      {userProgress?.isCompleted && (
        <Banner label="You have already completed this chapter." variant="success" />
      )}
      {isLocked && (
        <Banner
          label="You will need to purchase this course to proceed to this chapter."
          variant="warning"
        />
      )}
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
              {attachments.map((attachment) => (
                <Link
                  className="flex items-center p-3 w-full rounded-md bg-blue-500/15 border border-blue-500/20 text-blue-700 dark:text-blue-400"
                  key={attachment.id}
                  target="_blank"
                  href={attachment.url}
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-sm line-clamp-1 basis-4/5">{attachment.name}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChapterIdPage;
