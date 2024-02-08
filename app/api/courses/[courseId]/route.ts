import { HttpStatusCode } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { deleteFiles } from '@/actions/uploadthing/delete-files';
import { db } from '@/lib/db';

export const DELETE = async (_: NextRequest, { params }: { params: { courseId: string } }) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: HttpStatusCode.Unauthorized });
    }

    const course = await db.course.findUnique({
      where: { id: params.courseId, userId: user.userId },
      include: { chapters: { include: { muxData: true } }, attachments: true },
    });

    if (!course) {
      return new NextResponse('Not found', { status: HttpStatusCode.NotFound });
    }

    const attachmentFiles = course.attachments.reduce<string[]>((urls, attachment) => {
      const fileName = attachment?.url?.split('/').pop();

      if (fileName) {
        urls.push(fileName);
      }
      return urls;
    }, []);

    const videoFiles = course.chapters.reduce<string[]>((urls, chapter) => {
      const fileName = chapter?.muxData?.videoUrl?.split('/').pop();

      if (fileName) {
        urls.push(fileName);
      }
      return urls;
    }, []);

    await deleteFiles([
      ...attachmentFiles,
      ...videoFiles,
      ...(course?.imageUrl ? [course.imageUrl.split('/').pop()!] : []),
    ]);

    const deletedCourse = await db.course.delete({ where: { id: params.courseId } });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.error('[COURSE_ID_DELETE]', error);

    return new NextResponse('Internal Error', { status: HttpStatusCode.InternalServerError });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { courseId: string } }) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: HttpStatusCode.Unauthorized });
    }

    const values = await req.json();

    const course = await db.course.update({
      where: { id: params.courseId, userId: user.userId },
      data: { ...values },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('[COURSE_ID]', error);

    return new NextResponse('Internal Error', { status: HttpStatusCode.InternalServerError });
  }
};
