import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { db } from '@/lib/db';
import { pusher } from '@/server/pusher';
import { stripe } from '@/server/stripe';

export const PATCH = async (req: NextRequest, { params }: { params: { userId: string } }) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const { notification, ...values } = await req.json();

    const updatedUser = await db.user.update({
      where: { id: params.userId },
      data: { ...values },
    });

    if (notification) {
      await db.notification.create({
        data: {
          userId: params.userId,
          ...notification,
        },
      });

      await pusher.trigger(
        `notification_channel_${params.userId}`,
        `private_event_${params.userId}`,
        {
          trigger: true,
        },
      );
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('[PATCH_USER_ID]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

export const DELETE = async (_: NextRequest, { params }: { params: { userId: string } }) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const deletedUser = await db.user.delete({
      where: { id: params.userId },
    });

    const stripeCustomer = await db.stripeCustomer.findUnique({
      where: { userId: params.userId },
      select: { stripeCustomerId: true },
    });

    if (stripeCustomer) {
      await stripe.subscriptions.cancel(stripeCustomer.stripeCustomerId);
      await stripe.customers.del(stripeCustomer.stripeCustomerId);
      await db.stripeCustomer.delete({ where: { userId: params.userId } });
    }

    return NextResponse.json(deletedUser);
  } catch (error) {
    console.error('[DELETE_USER_ID]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
