import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';

import { TEN_MINUTE_SEC } from '@/constants/common';
import { fetchCachedData } from '@/lib/cache';
import { db } from '@/lib/db';

export const GET = async () => {
  try {
    const subscriptionDescription = await fetchCachedData(
      'subscription-description',
      async () => {
        const subscription = await db.stripeSubscriptionDescription.findMany();

        return subscription ?? [];
      },
      TEN_MINUTE_SEC,
    );

    return NextResponse.json(subscriptionDescription);
  } catch (error) {
    console.error('[PAYMENTS_SUBSCRIPTION]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
