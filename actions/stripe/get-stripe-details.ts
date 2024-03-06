'use server';

import { PayoutRequest, User } from '@prisma/client';

import { db } from '@/lib/db';
import { stripe } from '@/server/stripe';

type PayoutRequests = (Omit<PayoutRequest, 'connectAccount' | 'connectAccountId'> & {
  stripeAccountId: string;
  teacher: User;
})[];

export const getStripeDetails = async () => {
  try {
    const stripeBalance = await stripe.balance.retrieve();
    const payoutRequests = await db.payoutRequest.findMany({
      include: { connectAccount: true },
      orderBy: { createdAt: 'desc' },
    });

    const userIds = payoutRequests.map((pr) => pr.connectAccount.userId);

    const users = await db.user.findMany({ where: { id: { in: userIds } } });

    return {
      balances: {
        available: stripeBalance?.available?.reduce((acc, current) => acc + current.amount, 0) ?? 0,
        pending: stripeBalance?.pending?.reduce((acc, current) => acc + current.amount, 0) ?? 0,
      },
      payoutRequests: payoutRequests.reduce<PayoutRequests>((pr, current) => {
        const teacher = users.find((user) => user.id === current.connectAccount.userId);

        if (teacher) {
          pr.push({
            amount: current.amount,
            createdAt: current.createdAt,
            currency: current.currency,
            id: current.id,
            status: current.status,
            stripeAccountId: current.connectAccount.stripeAccountId,
            teacher,
            transactionId: current.transactionId,
            updatedAt: current.updatedAt,
          });
        }

        return pr;
      }, []),
    };
  } catch (error) {
    console.error('[GET_STRIPE_DETAILS_ACTION]', error);

    return {
      balances: {
        available: 0,
        pending: 0,
      },
      payoutRequests: [] as PayoutRequests,
    };
  }
};
