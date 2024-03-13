'use server';

import { db } from '@/lib/db';
import { stripe } from '@/server/stripe';

export const LoginUser = async (
  email: string,
  name?: string | null,
  pictureUrl?: string | null,
) => {
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

  return {
    id: user.id,
    image: user.pictureUrl,
    isPublic: user.isPublic,
    name: user.name,
    role: user.role,
    stripeCustomerId: stripeCustomer.stripeCustomerId,
  };
};
