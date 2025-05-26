'use server';

import { getTranslations } from 'next-intl/server';

import { db } from '@/lib/db';
import { createWebSocketNotification } from '@/lib/notifications';
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
    include: { stripeSubscription: true, settings: true },
  });

  if (existingUser) {
    return {
      hasSubscription: Boolean(existingUser.stripeSubscription),
      id: existingUser.id,
      image: existingUser.pictureUrl,
      isPublic: existingUser.settings?.isPublicProfile,
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

  const stripeCustomer = await db.stripeCustomer.findUnique({
    where: { userId: user.id },
    select: { stripeCustomerId: true },
  });

  if (!stripeCustomer) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user?.name ?? undefined,
    });

    await db.stripeCustomer.create({
      data: { userId: user.id, stripeCustomerId: customer.id },
    });
  }

  await createWebSocketNotification({
    channel: `notification_channel_${user.id}`,
    data: {
      body: t('welcomeBonus.body'),
      title: t('welcomeBonus.title'),
      userId: user.id,
    },
    event: `private_event_${user.id}`,
  });

  return {
    hasSubscription: false,
    id: user.id,
    image: user.pictureUrl,
    isPublic: false,
    name: user.name,
    otpSecret: user.otpSecret,
    role: user.role,
  };
};
