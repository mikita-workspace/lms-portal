import { addMonths } from 'date-fns';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { db } from '@/lib/db';
import { absoluteUrl } from '@/lib/utils';

export const POST = async (_: NextRequest, { params }: { params: { conversationId: string } }) => {
  try {
    const user = await getCurrentUser();

    if (!user?.hasSubscription) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    if (!params.conversationId) {
      return new NextResponse(ReasonPhrases.BAD_REQUEST, { status: StatusCodes.BAD_REQUEST });
    }

    const id = uuidv4();
    const link = absoluteUrl(`/chat/shared/${id}`);

    const newSharedConversation = await db.chatSharedConversation.create({
      data: {
        conversationId: params.conversationId,
        expireAt: addMonths(Date.now(), 1),
        id,
        link,
        userId: user.userId,
      },
      select: { link: true, isActive: true, expireAt: true, isOnlyAuth: true },
    });

    return NextResponse.json(newSharedConversation);
  } catch (error) {
    console.error('[POST_CONVERSATION_SHARE]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { conversationId: string } },
) => {
  try {
    const user = await getCurrentUser();

    if (!user?.hasSubscription) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    if (!params?.conversationId) {
      return new NextResponse(ReasonPhrases.BAD_REQUEST, { status: StatusCodes.BAD_REQUEST });
    }

    const { isActive, isOnlyAuth } = await req.json();

    const updatedSharedConversation = await db.chatSharedConversation.update({
      where: { conversationId: params.conversationId },
      data: {
        expireAt: addMonths(Date.now(), 1),
        isActive: isActive ?? false,
        isOnlyAuth: isOnlyAuth ?? false,
      },
      select: { link: true, isActive: true, expireAt: true, isOnlyAuth: true },
    });

    return NextResponse.json(updatedSharedConversation);
  } catch (error) {
    console.error('[PATCH_CONVERSATION_SHARE]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

export const DELETE = async (
  _: NextRequest,
  { params }: { params: { conversationId: string } },
) => {
  try {
    const user = await getCurrentUser();

    if (!user?.hasSubscription) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    if (!params?.conversationId) {
      return new NextResponse(ReasonPhrases.BAD_REQUEST, { status: StatusCodes.BAD_REQUEST });
    }

    await db.chatSharedConversation.delete({ where: { conversationId: params.conversationId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE_CONVERSATION_SHARE]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
