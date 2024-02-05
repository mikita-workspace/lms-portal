import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export const POST = async (req: Request) => {
  try {
    const userId = 'test';
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: HttpStatusCode.Unauthorized });
    }

    const course = await db.course.create({ data: { userId, title } });

    return NextResponse.json(course, { status: HttpStatusCode.Ok });
  } catch (error) {
    console.error('[COURSES]', error);

    return new NextResponse('Internal Error', { status: HttpStatusCode.InternalServerError });
  }
};
