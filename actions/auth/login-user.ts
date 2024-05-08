'use server';

import { db } from '@/lib/db';
import { generatePromotionCode } from '@/lib/promo';
import { pusher } from '@/server/pusher';
import { stripe } from '@/server/stripe';

export const LoginUser = async (
  email: string,
  name?: string | null,
  pictureUrl?: string | null,
) => {
  const existingUser = await db.user.findUnique({ where: { email } });

  if (existingUser) {
    return {
      id: existingUser.id,
      image: existingUser.pictureUrl,
      isPublic: existingUser.isPublic,
      name: existingUser.name,
      role: existingUser.role,
    };
  }

  const user = await db.user.upsert({
    where: {
      email,
    },
    update: {},
    create: {
      email,
      name,
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
    coupon: process.env.WELCOME_COUPON_ID as string,
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

  await db.notification.create({
    data: {
      userId: user.id,
      title: `Welcome bonus`,
      body: `Hi! Thank you for registering on our platform. Catch the promotion code - ${promotionCode.code} for your first purchase 🤩`,
    },
  });

  await pusher.trigger(`notification_channel_${user.id}`, `private_event_${user.id}`, {
    trigger: true,
  });

  return {
    id: user.id,
    email: user.email,
    image: user.pictureUrl,
    isPublic: user.isPublic,
    name: user.name,
    role: user.role,
  };
};
