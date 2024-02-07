import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { deleteFiles } from '@/actions/uploadthing/delete-files';
import { db } from '@/lib/db';

export const DELETE = async (
  { nextUrl: { searchParams } }: NextRequest,
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

    const attachmentName = searchParams.get('name');

    const attachment = await db.attachment.delete({
      where: { courseId: params.courseId, id: params.attachmentId },
    });

    if (attachmentName) {
      await deleteFiles([attachmentName]);
    }

    return NextResponse.json(attachment);
  } catch (error) {
    console.error('[ATTACHMENT_ID]', error);

    return new NextResponse('Internal Error', { status: HttpStatusCode.InternalServerError });
  }
};
