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
    });

    if (!course) {
      return new NextResponse('Unauthorized', { status: HttpStatusCode.Unauthorized });
    }

    const unpublishedCourse = await db.course.update({
      where: { id: params.courseId, userId: user.userId },
      data: { isPublished: false },
    });

    return NextResponse.json(unpublishedCourse);
  } catch (error) {
    console.error('[COURSES_ID_UNPUBLISH]', error);

    return new NextResponse('Internal Error', { status: HttpStatusCode.InternalServerError });
  }
};
