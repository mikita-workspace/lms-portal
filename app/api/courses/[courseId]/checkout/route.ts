import { Price } from '@prisma/client';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { db } from '@/lib/db';
import { stripe } from '@/server/stripe';

export const POST = async (req: NextRequest, { params }: { params: { courseId: string } }) => {
  try {
    const user = await getCurrentUser();

    if (!user || !user.email || !user.userId) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const course = await db.course.findUnique({
      where: { id: params.courseId, isPublished: true },
      include: { price: true },
    });

    const { currency } = await req.json();

    if (!course || !currency) {
      return new NextResponse(ReasonPhrases.NOT_FOUND, { status: StatusCodes.NOT_FOUND });
    }

    const purchase = await db.purchase.findUnique({
      where: { userId_courseId: { userId: user.userId, courseId: params.courseId } },
    });

    if (purchase) {
      return new NextResponse('Already purchased', { status: StatusCodes.BAD_REQUEST });
    }

    const unitAmount = Math.round(
      Number(course.price![currency.toLowerCase() as keyof Price]) * 100,
    );

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency,
          product_data: {
            name: course.title,
            description: course.description!,
          },
          unit_amount: unitAmount,
        },
      },
    ];

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: { userId: user.userId },
      select: { stripeCustomerId: true },
    });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user?.name || undefined,
      });

      stripeCustomer = await db.stripeCustomer.create({
        data: { userId: user.userId, stripeCustomerId: customer.id },
      });
    }

    const session = await stripe.checkout.sessions.create({
      allow_promotion_codes: true,
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
    console.error('[COURSE_ID_CHECKOUT]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
