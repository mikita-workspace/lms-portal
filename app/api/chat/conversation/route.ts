import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { CONVERSATION_ACTION } from '@/constants/chat';
import { db } from '@/lib/db';

export const POST = async (req: NextRequest) => {
  try {
    const user = await getCurrentUser();

    if (!user || !user?.hasSubscription) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const t = await getTranslations('chat.conversation');

    const action = req.nextUrl.searchParams.get('action');

    if (action === CONVERSATION_ACTION.DELETE_ALL) {
      await db.chatConversation.deleteMany({
        where: { userId: user.userId },
      });
    }

    if (action === CONVERSATION_ACTION.NEW) {
      const count = await db.chatConversation.count({ where: { userId: user.userId } });

      const newChatConversation = await db.chatConversation.create({
        data: {
          title: t('title', { order: count + 1 }),
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
