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

    if (!user || !user?.hasSubscription) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const { conversationId, messages, model } = await req.json();

    if (!messages?.length || !conversationId) {
      return new NextResponse(ReasonPhrases.BAD_REQUEST, { status: StatusCodes.BAD_REQUEST });
    }

    const chatMessages = await db.chatMessage.createManyAndReturn({
      data: messages.map(({ content, role }: { content: string; role: ChatRole }) => ({
        content,
        conversationId,
        model,
        role,
        // Necessary for the correct order of messages in DB
        createdAt: new Date(
          role === ChatCompletionRole.USER ? Date.now() : addMilliseconds(Date.now(), 10),
        ),
      })),
    });

    return NextResponse.json({ messages: chatMessages });
  } catch (error) {
    console.error('[POST_CHAT]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

// export const PATCH = async (req: NextRequest, { params }: { params: { userId: string } }) => {
//   try {
//     const user = await getCurrentUser();

//     if (!user) {
//       return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
//     }

//     const { id, ids, ...other } = await req.json();

//     const isUpdateAll = req.nextUrl.searchParams.get('all');

//     if (isUpdateAll) {
//       const updatedAllUserNotification = await db.notification.updateMany({
//         where: {
//           id: { in: ids.map((notification: { id: string }) => notification.id) },
//           userId: params.userId,
//         },
//         data: { isRead: other.isRead },
//       });

//       return NextResponse.json(updatedAllUserNotification);
//     }

//     const updatedUserNotification = await db.notification.update({
//       where: { id, userId: params.userId },
//       data: { ...other },
//       select: {
//         body: true,
//         createdAt: true,
//         id: true,
//         isRead: true,
//         title: true,
//         updatedAt: true,
//       },
//     });

//     return NextResponse.json(updatedUserNotification);
//   } catch (error) {
//     console.error('[UPDATE_USER_NOTIFICATION]', error);

//     return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
//       status: StatusCodes.INTERNAL_SERVER_ERROR,
//     });
//   }
// };

// export const DELETE = async (req: NextRequest, { params }: { params: { userId: string } }) => {
//   try {
//     const user = await getCurrentUser();

//     if (!user) {
//       return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
//     }

//     const id = req.nextUrl.searchParams.get('id');

//     if (id) {
//       const deletedUserNotification = await db.notification.delete({
//         where: { id, userId: params.userId },
//         select: {
//           id: true,
//         },
//       });

//       return NextResponse.json(deletedUserNotification);
//     }

//     return new NextResponse(ReasonPhrases.BAD_REQUEST, { status: StatusCodes.BAD_REQUEST });
//   } catch (error) {
//     console.error('[UPDATE_USER_NOTIFICATION]', error);

//     return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
//       status: StatusCodes.INTERNAL_SERVER_ERROR,
//     });
//   }
// };
