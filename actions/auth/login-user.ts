'use server';

import { getTranslations } from 'next-intl/server';

import { db } from '@/lib/db';
import { createWebSocketNotification } from '@/lib/notifications';
import { generatePromotionCode } from '@/lib/promo';
import { stripe } from '@/server/stripe';

import { getAppConfig } from '../configs/get-app-config';

export const loginUser = async (
  email: string,
  name?: string | null,
  pictureUrl?: string | null,
  password?: string | null,
) => {
  const config = await getAppConfig();

  const existingUser = await db.user.findUnique({
    where: { email },
    include: { stripeSubscription: true },
  });

  if (existingUser) {
    return {
      hasSubscription: Boolean(existingUser.stripeSubscription),
      id: existingUser.id,
      image: existingUser.pictureUrl,
      isPublic: existingUser.isPublic,
      name: existingUser.name,
      otpSecret: existingUser.otpSecret,
      role: existingUser.role,
    };
  }

  if (config?.auth?.isBlockedNewLogin) {
    return null;
  }

  const t = await getTranslations('auth');

  const user = await db.user.upsert({
    where: {
      email,
    },
    update: {},
    create: {
      email,
      name,
      password,
      pictureUrl,
    },
  });

  let stripeCustomer = await db.stripeCustomer.findUnique({
    where: { userId: user.id },
    select: { stripeCustomerId: true },
  });

  if (!stripeCustomer) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user?.name || undefined,
    });

    stripeCustomer = await db.stripeCustomer.create({
      data: { userId: user.id, stripeCustomerId: customer.id },
    });
  }

  const stripePromotion = await stripe.promotionCodes.create({
    code: generatePromotionCode(),
    coupon: process.env.STRIPE_COUPON_ID as string,
    customer: stripeCustomer.stripeCustomerId,
    max_redemptions: 1,
    restrictions: { first_time_transaction: true },
  });

  const promotionCode = await db.stripePromo.create({
    data: {
      code: stripePromotion.code,
      stripeCouponId: stripePromotion.coupon.id,
      stripePromoId: stripePromotion.id,
    },
  });

  await createWebSocketNotification({
    channel: `notification_channel_${user.id}`,
    data: {
      body: t('welcomeBonus.body', { promotionCode: promotionCode.code }),
      title: t('welcomeBonus.title'),
      userId: user.id,
    },
    event: `private_event_${user.id}`,
  });

  return {
    hasSubscription: false,
    id: user.id,
    image: user.pictureUrl,
    isPublic: user.isPublic,
    name: user.name,
    otpSecret: user.otpSecret,
    role: user.role,
  };
};
