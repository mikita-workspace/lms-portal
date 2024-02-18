import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { db } from '@/lib/db';

export const POST = async (req: NextRequest, { params }: { params: { courseId: string } }) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId: user.userId },
    });

    if (!courseOwner) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const { title } = await req.json();

    const lastChapter = await db.chapter.findFirst({
      where: { courseId: params.courseId },
      orderBy: { position: 'desc' },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 0;

    const chapter = await db.chapter.create({
      data: { title, courseId: params.courseId, position: newPosition },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.error('[CHAPTERS]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
