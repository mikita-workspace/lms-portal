import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);

    const { title } = await req.json();

    if (!session) {
      return new NextResponse('Unauthorized', { status: HttpStatusCode.Unauthorized });
    }

    const course = await db.course.create({ data: { userId: session.user.userId, title } });

    return NextResponse.json(course, { status: HttpStatusCode.Ok });
  } catch (error) {
    console.error('[COURSES]', error);

    return new NextResponse('Internal Error', { status: HttpStatusCode.InternalServerError });
  }
};
