import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { createCsmIssue } from '@/actions/csm/create-csm-issue';
import { db } from '@/lib/db';
import { createWebSocketNotification } from '@/lib/notifications';
import { stripe } from '@/server/stripe';

type RequestProps = { params: Promise<{ userId: string }> };

export const GET = async (_: NextRequest, props: RequestProps) => {
  const { userId } = await props.params;

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { stripeSubscription: true },
    });

    if (!user || !user?.isPublic) {
      return new NextResponse(ReasonPhrases.BAD_REQUEST, { status: StatusCodes.BAD_REQUEST });
    }

    return NextResponse.json({
      createdAt: user.createdAt,
      email: user.email,
      hasSubscription: Boolean(user.stripeSubscription),
      name: user.name,
      pictureUrl: user.pictureUrl,
      role: user.role,
    });
  } catch (error) {
    console.error('[GET_USER_ID]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

export const PATCH = async (req: NextRequest, props: RequestProps) => {
  const { userId } = await props.params;

  const user = await getCurrentUser();

  try {
    if (!user) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const { notification, ...values } = await req.json();

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { ...values },
    });

    if (notification) {
      await createWebSocketNotification({
        channel: `notification_channel_${userId}`,
        data: {
          userId,
          ...notification,
        },
        event: `private_event_${userId}`,
      });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('[PATCH_USER_ID]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

export const DELETE = async (_: NextRequest, props: RequestProps) => {
  const { userId } = await props.params;

  const user = await getCurrentUser();

  try {
    if (!user) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const stripeCustomer = await db.stripeCustomer.findUnique({
      where: { userId },
      select: { stripeCustomerId: true },
    });

    const stripeSubscription = await db.stripeSubscription.findUnique({
      where: { userId },
    });

    if (stripeSubscription?.stripeSubscriptionId) {
      await stripe.subscriptions.cancel(stripeSubscription.stripeSubscriptionId);
    }

    if (stripeCustomer) {
      await stripe.customers.del(stripeCustomer.stripeCustomerId);
      await db.stripeCustomer.delete({ where: { userId } });
    }

    const deletedUser = await db.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(deletedUser);
  } catch (error) {
    console.error('[DELETE_USER_ID]', error);

    await createCsmIssue({
      categoryId: '807f46f7-7a39-4b96-9e36-c928fd218c5c',
      description: JSON.stringify(error),
      email: user?.email,
      userId,
    });

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
