import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { db } from '@/lib/db';

export const POST = async (req: NextRequest, { params }: { params: { courseId: string } }) => {
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

    const { files } = await req.json();

    const attachments = await db.attachment.createMany({
      data: files.map((file: { url: string; name: string }) => ({
        url: file.url,
        name: file.name,
        courseId: params.courseId,
      })),
    });

    return NextResponse.json(attachments);
  } catch (error) {
    console.error('[COURSE_ID_ATTACHMENTS]', error);

    return new NextResponse('Internal Error', { status: HttpStatusCode.InternalServerError });
  }
};
