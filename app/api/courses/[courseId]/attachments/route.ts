import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/get-current-user';
import { db } from '@/lib/db';

export const POST = async (req: Request, { params }: { params: { courseId: string } }) => {
  try {
    const user = await getCurrentUser();

    const { url } = await req.json();

    if (!user) {
      return new NextResponse('Unauthorized', { status: HttpStatusCode.Unauthorized });
    }

    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId: user.userId },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: HttpStatusCode.Unauthorized });
    }

    const attachment = await db.attachment.create({
      data: { url, name: url.split('/').pop(), courseId: params.courseId },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error('[COURSE_ID_ATTACHMENTS]', error);

    return new NextResponse('Internal Error', { status: HttpStatusCode.InternalServerError });
  }
};
