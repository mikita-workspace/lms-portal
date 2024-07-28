import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { authenticator } from 'otplib';

export const POST = async (req: NextRequest) => {
  try {
    const { token, secret } = await req.json();

    const isValid = authenticator.verify({ token, secret });

    return NextResponse.json({ verified: isValid });
  } catch (error) {
    console.error('[OTP_VERIFY]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
