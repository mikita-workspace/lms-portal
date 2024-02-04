import { auth } from '@clerk/nextjs';
import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export const PATCH = async (req: Request, { params }: { params: { courseId: string } }) => {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: HttpStatusCode.Unauthorized });
    }

    const course = await db.course.update({ where: { id: courseId, userId }, data: { ...values } });

    return NextResponse.json(course, { status: HttpStatusCode.Ok });
  } catch (error) {
    console.error('[COURSE_ID]', error);

    return new NextResponse('Internal Error', { status: HttpStatusCode.InternalServerError });
  }
};
