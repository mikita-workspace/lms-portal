import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { DEFAULT_LOCALE } from '@/constants/locale';
import { PayoutRequestStatus } from '@/constants/payments';
import { db } from '@/lib/db';
import { formatPrice, getConvertedPrice } from '@/lib/format';
import { isOwner } from '@/lib/owner';
import { pusher } from '@/server/pusher';
import { stripe } from '@/server/stripe';

export const POST = async (
  { nextUrl: { searchParams } }: NextRequest,
  { params }: { params: { requestId: string } },
) => {
  try {
    const user = await getCurrentUser();

    if (!user || !isOwner(user.userId)) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const action = searchParams.get('action');

    if (action === PayoutRequestStatus.DECLINED) {
      const payoutRequest = await db.payoutRequest.update({
        where: { id: params.requestId },
        data: {
          status: action,
        },
        include: { connectAccount: true },
      });

      await db.notification.create({
        data: {
          userId: payoutRequest.connectAccount.userId,
          title: `Payout Request #${payoutRequest.id}`,
          body: 'Your payout request has been declined.',
        },
      });

      await pusher.trigger(
        `notification_channel_${payoutRequest.connectAccount.userId}`,
        `private_event_${payoutRequest.connectAccount.userId}`,
        {
          trigger: true,
        },
      );

      return NextResponse.json(payoutRequest);
    }

    if (action === PayoutRequestStatus.PAID) {
      const payoutRequest = await db.payoutRequest.findUnique({
        where: { id: params.requestId },
        include: { connectAccount: true },
      });

      if (!payoutRequest) {
        return new NextResponse(ReasonPhrases.BAD_REQUEST, { status: StatusCodes.BAD_REQUEST });
      }

      const transfer = await stripe.transfers.create({
        amount: payoutRequest.amount,
        currency: payoutRequest.currency,
        destination: payoutRequest.connectAccount.stripeAccountId,
      });

      const updatedPayoutRequest = await db.payoutRequest.update({
        where: { id: params.requestId },
        data: {
          destinationPaymentId: transfer.destination_payment?.toString(),
          status: action,
          transactionId: transfer.balance_transaction?.toString(),
        },
      });

      await db.notification.create({
        data: {
          userId: payoutRequest.connectAccount.userId,
          title: `Payout Request #${payoutRequest.id}`,
          body: `The payout request has been successfully completed. ${formatPrice(getConvertedPrice(updatedPayoutRequest.amount), { locale: DEFAULT_LOCALE, currency: updatedPayoutRequest.currency })} was transferred to your Stripe account.`,
        },
      });

      await pusher.trigger(
        `notification_channel_${payoutRequest.connectAccount.userId}`,
        `private_event_${payoutRequest.connectAccount.userId}`,
        {
          trigger: true,
        },
      );

      return NextResponse.json(updatedPayoutRequest);
    }

    return new NextResponse(ReasonPhrases.BAD_REQUEST, { status: StatusCodes.BAD_REQUEST });
  } catch (error) {
    console.error('[PAYMENTS_PAYOUT]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
