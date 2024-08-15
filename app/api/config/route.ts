import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { db } from '@/lib/db';
import { isOwner } from '@/lib/owner';

export const PATCH = async (req: NextRequest) => {
  try {
    const user = await getCurrentUser();

    if (!isOwner(user?.userId)) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const { authFlow } = await req.json();

    const updatedConfig = Promise.all(
      authFlow.map(async (af: { id: string; isActive: boolean }) => {
        const config = await db.authFlow.update({
          where: { id: af.id },
          data: { isActive: af.isActive },
          select: {
            isActive: true,
            provider: true,
          },
        });

        return config;
      }),
    );

    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error('[APP_CONFIG]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
