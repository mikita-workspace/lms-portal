import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { db } from '@/lib/db';

export const GET = async (_: NextRequest, { params }: { params: { userId: string } }) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const userNotifications = await db.notification.findMany({
      where: { userId: params.userId },
      orderBy: { createdAt: 'desc' },
      select: {
        body: true,
        createdAt: true,
        id: true,
        isRead: true,
        title: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(userNotifications);
  } catch (error) {
    console.error('[GET_USER_NOTIFICATION]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

export const PATCH = async (req: NextRequest, { params }: { params: { userId: string } }) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const { id, ids, ...other } = await req.json();

    const isUpdateAll = req.nextUrl.searchParams.get('all');

    if (isUpdateAll) {
      const updatedAllUserNotification = await db.notification.updateMany({
        where: {
          id: { in: ids.map((notification: { id: string }) => notification.id) },
          userId: params.userId,
        },
        data: { isRead: other.isRead },
      });

      return NextResponse.json(updatedAllUserNotification);
    }

    const updatedUserNotification = await db.notification.update({
      where: { id, userId: params.userId },
      data: { ...other },
      select: {
        body: true,
        createdAt: true,
        id: true,
        isRead: true,
        title: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUserNotification);
  } catch (error) {
    console.error('[UPDATE_USER_NOTIFICATION]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { userId: string } }) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const id = req.nextUrl.searchParams.get('id');

    if (id) {
      const deletedUserNotification = await db.notification.delete({
        where: { id, userId: params.userId },
        select: {
          id: true,
        },
      });

      return NextResponse.json(deletedUserNotification);
    }

    return new NextResponse(ReasonPhrases.BAD_REQUEST, { status: StatusCodes.BAD_REQUEST });
  } catch (error) {
    console.error('[UPDATE_USER_NOTIFICATION]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
