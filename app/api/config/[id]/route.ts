import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { db } from '@/lib/db';
import { isOwner } from '@/lib/owner';

export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const user = await getCurrentUser();

    if (!isOwner(user?.userId)) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const { authFlow } = await req.json();

    const updatedConfig = await db.configuration.update({
      where: { id: params.id },
      data: { authFlowJson: JSON.stringify(authFlow) },
    });

    return NextResponse.json(updatedConfig);
  } catch (error) {
    console.error('[APP_CONFIG]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
