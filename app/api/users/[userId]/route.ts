import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { db } from '@/lib/db';

export const PATCH = async (req: NextRequest, { params }: { params: { userId: string } }) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const values = await req.json();

    const updatedUser = await db.user.update({
      where: { id: params.userId },
      data: { ...values },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('[USER_ID]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
