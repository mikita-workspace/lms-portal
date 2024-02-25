import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { db } from '@/lib/db';

export const POST = async (req: NextRequest) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const { title } = await req.json();

    const course = await db.course.create({ data: { userId: user.userId, title } });

    return NextResponse.json(course);
  } catch (error) {
    console.error('[COURSES]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
