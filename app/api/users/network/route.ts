import { geolocation, ipAddress } from '@vercel/functions';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    const ip = ipAddress(req);
    const geo = geolocation(req);

    return NextResponse.json({
      ip,
      ...geo,
    });
  } catch (error) {
    console.error('[GET_USERS_NETWORK]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
