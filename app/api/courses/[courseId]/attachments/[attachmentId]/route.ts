import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/get-current-user';
import { db } from '@/lib/db';

export const DELETE = async (
  _: Request,
  { params }: { params: { attachmentId: string; courseId: string } },
) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: HttpStatusCode.Unauthorized });
    }

    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId: user.userId },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: HttpStatusCode.Unauthorized });
    }

    const attachment = await db.attachment.delete({
      where: { courseId: params.courseId, id: params.attachmentId },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error('[ATTACHMENT_ID]', error);

    return new NextResponse('Internal Error', { status: HttpStatusCode.InternalServerError });
  }
};
