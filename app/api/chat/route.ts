import { addMilliseconds } from 'date-fns';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { ChatCompletionRole as ChatRole } from 'openai/resources/index.mjs';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { ChatCompletionRole } from '@/constants/open-ai';
import { db } from '@/lib/db';

export const POST = async (req: NextRequest) => {
  try {
    const user = await getCurrentUser();

    if (!user?.hasSubscription) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const { conversationId, messages, model } = await req.json();

    if (!messages?.length || !conversationId) {
      return new NextResponse(ReasonPhrases.BAD_REQUEST, { status: StatusCodes.BAD_REQUEST });
    }

    const chatMessages = await db.chatMessage.createManyAndReturn({
      data: messages.map(
        ({ id, content, role }: { id: string; content: string; role: ChatRole }) => ({
          id,
          content,
          conversationId,
          model,
          role,
          // Necessary for the correct order of messages in DB
          createdAt: new Date(
            role === ChatCompletionRole.USER ? Date.now() : addMilliseconds(Date.now(), 10),
          ),
        }),
      ),
    });

    return NextResponse.json({ messages: chatMessages });
  } catch (error) {
    console.error('[POST_CHAT]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
