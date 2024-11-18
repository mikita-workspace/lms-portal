import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { CONVERSATION_ACTION } from '@/constants/chat';
import { generateConversationTitle } from '@/lib/chat';
import { db } from '@/lib/db';

export const POST = async (req: NextRequest) => {
  try {
    const user = await getCurrentUser();

    if (!user?.hasSubscription) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const action = req.nextUrl.searchParams.get('action');

    if (action === CONVERSATION_ACTION.DELETE_ALL) {
      await db.chatConversation.deleteMany({
        where: { userId: user.userId },
      });
    }

    if (action === CONVERSATION_ACTION.NEW) {
      const { title } = await req.json();

      const lastConversation = await db.chatConversation.findFirst({
        where: { userId: user?.userId },
        orderBy: { position: 'desc' },
      });

      const nextPosition = lastConversation ? lastConversation.position + 1 : 0;

      const newChatConversation = await db.chatConversation.create({
        data: {
          position: nextPosition,
          title: title || generateConversationTitle(),
          userId: user?.userId,
        },
        select: {
          id: true,
          title: true,
        },
      });

      return NextResponse.json({
        id: newChatConversation.id,
        title: newChatConversation.title,
        messages: [],
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[POST_CHAT_CONVERSATION]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
