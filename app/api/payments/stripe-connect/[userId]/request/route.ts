import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { PayoutRequestStatus } from '@/constants/payments';
import { db } from '@/lib/db';
import { pusher } from '@/server/pusher';
import { stripe } from '@/server/stripe';

export const POST = async (req: NextRequest, { params }: { params: { userId: string } }) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const { amount, currency } = await req.json();

    const connectAccount = await db.stripeConnectAccount.findUnique({
      where: { userId: params.userId },
    });

    if (!connectAccount) {
      return new NextResponse(ReasonPhrases.BAD_REQUEST, { status: StatusCodes.BAD_REQUEST });
    }

    const t = await getTranslations('payments.stripe-connect');

    const stripeBalance = await stripe.balance.retrieve();
    const availableBalance =
      stripeBalance?.available?.reduce((acc, current) => acc + current.amount, 0) ?? 0;

    if (amount > availableBalance) {
      return new NextResponse(t('emptyBalance'), {
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const payoutRequest = await db.payoutRequest.create({
      data: {
        amount,
        connectAccountId: connectAccount.id,
        currency,
        status: PayoutRequestStatus.PENDING,
      },
    });

    // Notification for the bank account holder
    await db.notification.create({
      data: {
        body: t('request.body', { username: user.name }),
        title: t('request.title', { payoutRequestId: payoutRequest.id }),
        userId: process.env.NEXT_PUBLIC_OWNER_ID as string,
      },
    });

    await pusher.trigger(
      `notification_channel_${process.env.NEXT_PUBLIC_OWNER_ID}`,
      `private_event_${process.env.NEXT_PUBLIC_OWNER_ID}`,
      {
        trigger: true,
      },
    );

    return NextResponse.json(payoutRequest);
  } catch (error) {
    console.error('[PAYMENTS_STRIPE_CREATE]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
