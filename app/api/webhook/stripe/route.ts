import { StatusCodes } from 'http-status-codes';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import stripe from 'stripe';

import { db } from '@/lib/db';

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

  if (event.type === 'checkout.session.completed') {
    if (!userId || !courseId) {
      return new NextResponse('Webhook Error: Missing metadata', {
        status: StatusCodes.BAD_REQUEST,
      });
    }

    const purchase = await db.purchase.create({
      data: {
        courseId,
        userId,
      },
    });

    const invoiceId = (() => {
      if (typeof session.invoice === 'string') {
        return session.invoice;
      }

      if (typeof session.invoice === 'object') {
        return session.invoice?.id;
      }
      return null;
    })();

    await db.purchaseDetails.create({
      data: {
        city: session?.metadata?.city,
        country: session?.metadata?.country,
        countryCode: session?.metadata?.countryCode,
        currency: session.currency,
        invoiceId,
        latitude: Number(session?.metadata?.latitude),
        longitude: Number(session?.metadata?.longitude),
        purchaseId: purchase.id,
      },
    });
  } else {
    return new NextResponse(`Webhook Error: Unhandled event type ${event.type}`);
  }

  return new NextResponse(null);
};
