import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { deleteFiles } from '@/actions/uploadthing/delete-files';
import { db } from '@/lib/db';

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { courseId: string; chapterId: string } },
) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: StatusCodes.UNAUTHORIZED });
    }

    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId: user.userId },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: StatusCodes.UNAUTHORIZED });
    }

    const chapter = await db.chapter.findUnique({
      where: { id: params.chapterId, courseId: params.courseId },
    });

    if (!chapter) {
      return new NextResponse('Not Found', { status: StatusCodes.NOT_FOUND });
    }

    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId: params.chapterId },
      });

      if (existingMuxData) {
        const fileName = existingMuxData?.videoUrl?.split('/').pop();

        await db.muxData.delete({ where: { id: existingMuxData.id } });

        if (fileName) {
          await deleteFiles([fileName]);
        }
      }
    }

    const deletedChapter = await db.chapter.delete({ where: { id: params.chapterId } });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: { courseId: params.courseId, isPublished: true },
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({ where: { id: params.courseId }, data: { isPublished: false } });
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.error('[COURSES_CHAPTER_ID_DELETE]', error);

    return new NextResponse('Internal Error', { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { courseId: string; chapterId: string } },
) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: StatusCodes.UNAUTHORIZED });
    }

    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId: user.userId },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: StatusCodes.UNAUTHORIZED });
    }

    const values = await req.json();

    const chapter = await db.chapter.update({
      where: { id: params.chapterId, courseId: params.courseId },
      data: { ...values },
    });

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId: params.chapterId },
      });

      if (existingMuxData) {
        const fileName = existingMuxData?.videoUrl?.split('/').pop();

        await db.muxData.delete({ where: { id: existingMuxData.id } });

        if (fileName) {
          await deleteFiles([fileName]);
        }
      }

      await db.muxData.create({
        data: {
          chapterId: params.chapterId,
          videoUrl: values.videoUrl,
        },
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error('[COURSES_CHAPTER_ID]', error);

    return new NextResponse('Internal Error', { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};
