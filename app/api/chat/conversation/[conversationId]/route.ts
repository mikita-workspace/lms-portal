import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { CONVERSATION_ACTION } from '@/constants/chat';
import { db } from '@/lib/db';

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { conversationId: string } },
) => {
  try {
    const user = await getCurrentUser();

    if (!user || !user?.hasSubscription) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    if (!params?.conversationId) {
      return new NextResponse(ReasonPhrases.BAD_REQUEST, { status: StatusCodes.BAD_REQUEST });
    }

    const action = req.nextUrl.searchParams.get('action');

    if (action === CONVERSATION_ACTION.EMPTY_MESSAGES) {
      await db.chatMessage.deleteMany({ where: { conversationId: params.conversationId } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[PATCH_CHAT_CONVERSATION]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
