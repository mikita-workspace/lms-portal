import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { db } from '@/lib/db';

export const PATCH = async (_: NextRequest, { params }: { params: { courseId: string } }) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: HttpStatusCode.Unauthorized });
    }

    const course = await db.course.findUnique({
      where: { id: params.courseId, userId: user.userId },
      include: { chapters: { include: { muxData: true } } },
    });

    if (!course) {
      return new NextResponse('Unauthorized', { status: HttpStatusCode.Unauthorized });
    }

    const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished);

    if (
      !course.categoryId ||
      !course.description ||
      !course.imageUrl ||
      !course.title ||
      !hasPublishedChapter
    ) {
      return new NextResponse('Missing required fields', {
        status: HttpStatusCode.BadRequest,
      });
    }

    const publishedCourse = await db.course.update({
      where: { id: params.courseId, userId: user.userId },
      data: { isPublished: true },
    });

    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.error('[COURSES_ID_PUBLISH]', error);

    return new NextResponse('Internal Error', { status: HttpStatusCode.InternalServerError });
  }
};