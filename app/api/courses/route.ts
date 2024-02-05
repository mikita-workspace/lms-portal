import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/get-current-user';
import { db } from '@/lib/db';

export const POST = async (req: Request) => {
  try {
    const user = await getCurrentUser();

    const { title } = await req.json();

    if (!user) {
      return new NextResponse('Unauthorized', { status: HttpStatusCode.Unauthorized });
    }

    const course = await db.course.create({ data: { userId: user.userId, title } });

    return NextResponse.json(course, { status: HttpStatusCode.Ok });
  } catch (error) {
    console.error('[COURSES]', error);

    return new NextResponse('Internal Error', { status: HttpStatusCode.InternalServerError });
  }
};
