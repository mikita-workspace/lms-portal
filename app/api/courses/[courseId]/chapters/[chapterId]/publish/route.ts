import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { db } from '@/lib/db';

export const PATCH = async (
  _: NextRequest,
  { params }: { params: { courseId: string; chapterId: string } },
) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId: user.userId },
    });

    if (!courseOwner) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const t = await getTranslations('courses.publish');

    const chapter = await db.chapter.findUnique({
      where: { id: params.chapterId, courseId: params.courseId },
    });

    const muxData = await db.muxData.findUnique({ where: { chapterId: params.chapterId } });

    if (!chapter || !muxData || !chapter.title) {
      return new NextResponse(t('errors.missingRequiredFields'), {
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const publishedChapter = await db.chapter.update({
      where: { id: params.chapterId, courseId: params.courseId },
      data: { isPublished: true },
    });

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.error('[COURSES_CHAPTER_ID_PUBLISH]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
