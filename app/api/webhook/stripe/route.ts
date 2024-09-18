import { fromUnixTime } from 'date-fns';
import { StatusCodes } from 'http-status-codes';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { removeValueFromMemoryCache } from '@/lib/cache';
import { db } from '@/lib/db';
import { isObject, isString } from '@/lib/guard';
import { stripe } from '@/server/stripe';

export const POST = async (req: NextRequest) => {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error?.message}`, {
      status: StatusCodes.BAD_REQUEST,
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;
  const isSubscription = session.metadata?.isSubscription;

  if (event.type === 'checkout.session.completed') {
    if (!userId || (!isSubscription && !courseId)) {
      return new NextResponse('Webhook Error: Missing metadata', {
        status: StatusCodes.BAD_REQUEST,
      });
    }

    if (isSubscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

      const response = await db.stripeSubscription.create({
        data: {
          endDate: new Date(subscription.current_period_end * 1000),
          name: session?.metadata?.subscriptionName ?? '',
          startDate: new Date(subscription.current_period_start * 1000),
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeSubscriptionId: subscription.id,
          userId,
        },
      });

      await removeValueFromMemoryCache(`user-subscription-[${userId}]`);

      return new NextResponse(JSON.stringify(response));
    } else {
      const purchase = await db.purchase.create({
        data: {
          courseId: courseId!,
          userId,
        },
      });

      const invoiceId = (() => {
        if (isString(session.invoice)) {
          return session.invoice;
        }

        if (isObject(session.invoice)) {
          return session.invoice?.id;
        }
        return null;
      })();

      const response = await db.purchaseDetails.create({
        data: {
          city: session?.metadata?.city,
          country: session?.metadata?.country,
          countryCode: session?.metadata?.countryCode,
          currency: session.currency?.toUpperCase(),
          invoiceId,
          latitude: Number(session?.metadata?.latitude),
          longitude: Number(session?.metadata?.longitude),
          paymentIntent: session.payment_intent?.toString(),
          price: session.amount_total ?? 0,
          purchaseId: purchase.id,
        },
      });

      return new NextResponse(JSON.stringify(response));
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription: Stripe.Subscription = event.data.object;

    const isSubscriptionExist = await db.stripeSubscription.findUnique({
      where: { stripeSubscriptionId: subscription.id },
      select: { id: true },
    });

    if (isSubscriptionExist) {
      const response = await db.stripeSubscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          cancelAt: subscription.cancel_at ? fromUnixTime(subscription.cancel_at) : null,
        },
      });

      return new NextResponse(JSON.stringify(response));
    }

    return new NextResponse(null);
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;

    const response = await db.stripeSubscription.delete({
      where: { stripeSubscriptionId: subscription.id },
    });

    return new NextResponse(JSON.stringify(response));
  }

  return new NextResponse(`Webhook Error: Unhandled event type ${event.type}`);
};
