import { addSeconds, getUnixTime } from 'date-fns';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { getLocale as getAppLocale, getTranslations } from 'next-intl/server';
import Stripe from 'stripe';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getWelcomeDiscounts } from '@/actions/stripe/get-welcome-discounts';
import { db } from '@/lib/db';
import { getLocale } from '@/lib/locale';
import { absoluteUrl } from '@/lib/utils';
import { stripe } from '@/server/stripe';

export const POST = async (req: NextRequest, props: { params: Promise<{ courseId: string }> }) => {
  const { courseId } = await props.params;

  try {
    const user = await getCurrentUser();

    if (!user || !user.email || !user.userId) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const course = await db.course.findUnique({
      where: { id: courseId, isPublished: true },
    });

    const { locale, details, rate } = await req.json();

    if (!course || !locale?.currency) {
      return new NextResponse(ReasonPhrases.NOT_FOUND, { status: StatusCodes.NOT_FOUND });
    }

    const t = await getTranslations('courses.checkout');

    const purchase = await db.purchase.findUnique({
      where: { userId_courseId: { userId: user.userId, courseId } },
    });

    if (purchase) {
      return new NextResponse(t('errors.alreadyPurchased'), { status: StatusCodes.BAD_REQUEST });
    }

    const metadata = {
      ...details,
      courseId: course.id,
      userId: user.userId,
    };

    if (!course.price) {
      await db.$transaction(async (prisma) => {
        const purchase = await prisma.purchase.create({
          data: {
            courseId: metadata.courseId,
            userId: metadata.userId,
          },
        });

        const transaction = await prisma.purchaseDetails.create({
          data: {
            city: metadata?.city,
            country: metadata?.country,
            countryCode: metadata?.countryCode,
            currency: locale.currency.toUpperCase(),
            latitude: Number(metadata?.latitude),
            longitude: Number(metadata?.longitude),
            price: 0,
            purchaseId: purchase.id,
          },
        });

        return transaction;
      });

      return NextResponse.json({
        url: absoluteUrl(`/courses/${metadata.courseId}`),
      });
    }

    const appLocale = await getAppLocale();

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: locale.currency,
          product_data: {
            name: course.title,
          },
          unit_amount: Math.round((course.price ?? 0) * rate),
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

    const discounts = await getWelcomeDiscounts(user.userId);

    const session = await stripe.checkout.sessions.create({
      ...(discounts.length ? { discounts } : { allow_promotion_codes: true }),
      cancel_url: absoluteUrl(`/preview-course/${course.id}?canceled=true`),
      customer: stripeCustomer.stripeCustomerId,
      expires_at: getUnixTime(addSeconds(Date.now(), 3600)),
      payment_method_types: ['card'],
      invoice_creation: {
        enabled: true,
      },
      locale: getLocale(appLocale, ['be']) as Stripe.Checkout.Session.Locale,
      line_items: lineItems,
      mode: 'payment',
      success_url: absoluteUrl(`/preview-course/${course.id}?success=true`),
      metadata,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[COURSE_ID_CHECKOUT]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
