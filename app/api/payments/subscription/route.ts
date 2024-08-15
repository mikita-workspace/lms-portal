import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { TEN_MINUTE_SEC } from '@/constants/common';
import { fetchCachedData } from '@/lib/cache';
import { db } from '@/lib/db';
import { absoluteUrl } from '@/lib/utils';
import { stripe } from '@/server/stripe';

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

export const POST = async (req: NextRequest) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const { details, locale, price, rate, recurringInterval, returnUrl, subscriptionName } =
      await req.json();

    const userSubscription = await db.stripeSubscription.findUnique({
      where: { userId: user?.userId },
    });

    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: absoluteUrl(returnUrl),
      });

      return NextResponse.json({ url: stripeSession.url });
    }

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: { userId: user?.userId },
      select: { stripeCustomerId: true },
    });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user?.email || '',
        name: user?.name || undefined,
      });

      stripeCustomer = await db.stripeCustomer.create({
        data: { userId: user.userId, stripeCustomerId: customer.id },
      });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: stripeCustomer.stripeCustomerId,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: locale.currency,
            product_data: { name: subscriptionName },
            unit_amount: Math.round((price ?? 0) * rate),
            recurring: { interval: recurringInterval },
          },
        },
      ],
      metadata: {
        ...details,
        isSubscription: true,
        subscriptionName,
        userId: user?.userId,
      },
      success_url: absoluteUrl(`${returnUrl}?success=true`),
      cancel_url: absoluteUrl(returnUrl),
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error('[PAYMENTS_SUBSCRIPTION_[USER_ID]]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
