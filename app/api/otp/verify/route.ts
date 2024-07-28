import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { authenticator } from 'otplib';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { db } from '@/lib/db';

export const POST = async (req: NextRequest) => {
  try {
    const user = await getCurrentUser();

    const { token, secret } = await req.json();

    const userData = await db.user.findUnique({
      where: { id: user?.userId },
      select: { otpSecret: true },
    });

    let isValid = false;

    if (userData?.otpSecret) {
      isValid = authenticator.verify({ token, secret: userData.otpSecret });
    } else {
      isValid = authenticator.verify({ token, secret });

      if (isValid) {
        await db.user.update({
          where: { id: user?.userId },
          data: { otpSecret: secret, otpCreatedAt: new Date() },
        });
      }
    }

    return NextResponse.json({ verified: isValid });
  } catch (error) {
    console.error('[OTP_VERIFY]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
