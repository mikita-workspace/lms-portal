import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getChapter } from '@/actions/db/get-chapter';
import { Banner } from '@/components/common/banner';

import { ChapterVideoPlayer } from './_components/chapter-video-player';

type ChapterIdPageProps = {
  params: { courseId: string; chapterId: string };
};

const ChapterIdPage = async ({ params }: ChapterIdPageProps) => {
  const user = await getCurrentUser();

  if (!user) {
    return redirect('/');
  }

  const { chapter, course, muxData, attachments, nextChapter, userProgress, purchase } =
    await getChapter({
      chapterId: params.chapterId,
      courseId: params.courseId,
      userId: user.userId,
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
            title={chapter.title}
            videoUrl={muxData?.videoUrl}
          />
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
