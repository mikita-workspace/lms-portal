import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/get-current-user';
import { db } from '@/lib/db';

export const PATCH = async (req: Request, { params }: { params: { courseId: string } }) => {
  try {
    const user = await getCurrentUser();

    const { courseId } = params;
    const values = await req.json();

    if (!user) {
      return new NextResponse('Unauthorized', { status: HttpStatusCode.Unauthorized });
    }

    const course = await db.course.update({
      where: { id: courseId, userId: user.userId },
      data: { ...values },
    });

    return NextResponse.json(course, { status: HttpStatusCode.Ok });
  } catch (error) {
    console.error('[COURSE_ID]', error);

    return new NextResponse('Internal Error', { status: HttpStatusCode.InternalServerError });
  }
};
