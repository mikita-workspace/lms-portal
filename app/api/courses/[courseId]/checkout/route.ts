import { StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { Currency } from '@/constants/locale';
import { db } from '@/lib/db';
import { stripe } from '@/lib/stripe';

export const POST = async (_: NextRequest, { params }: { params: { courseId: string } }) => {
  try {
    const user = await getCurrentUser();

    if (!user || !user.email || !user.userId) {
      return new NextResponse('Unauthorized', { status: StatusCodes.UNAUTHORIZED });
    }

    const course = await db.course.findUnique({
      where: { id: params.courseId, isPublished: true },
    });

    const purchase = await db.purchase.findUnique({
      where: { userId_courseId: { userId: user.userId, courseId: params.courseId } },
    });

    if (purchase) {
      return new NextResponse('Already purchased', { status: StatusCodes.BAD_REQUEST });
    }

    if (!course) {
      return new NextResponse('Not found', { status: StatusCodes.NOT_FOUND });
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: Currency.USD,
          product_data: {
            name: course.title,
            description: course.description!,
          },
          unit_amount: Math.round(course.price! * 100),
        },
      },
    ];

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: { userId: user.userId },
      select: { stripeCustomerId: true },
    });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({ email: user.email });

      stripeCustomer = await db.stripeCustomer.create({
        data: { userId: user.userId, stripeCustomerId: customer.id },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=true`,
      metadata: {
        courseId: course.id,
        userId: user.userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log('[COURSE_ID_CHECKOUT]', error);

    return new NextResponse('Internal Error', { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
};
