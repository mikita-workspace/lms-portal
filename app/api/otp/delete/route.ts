import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';

export const PATCH = async (req: NextRequest) => {
  try {
    const { email } = await req.json();

    await db.user.update({ where: { email }, data: { otpCreatedAt: null, otpSecret: null } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[OTP_DELETE]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
