'use server';

import { stripe } from '@/server/stripe';

export const getAdminInfo = async () => {
  try {
    const stripeBalance = await stripe.balance.retrieve();
    const stripeTransaction = await stripe.balanceTransactions.list();

    return {
      stripeBalances: {
        available: stripeBalance.available,
        pending: stripeBalance.pending,
      },
      stripeTransactions: stripeTransaction.data.map((dt) => ({
        amount: dt.amount,
        created: dt.created,
        currency: dt.currency,
        fee: dt.fee,
        feeDetails: dt.fee_details,
        id: dt.id,
        net: dt.net,
        status: dt.status,
        type: dt.type,
      })),
    };
  } catch (error) {
    console.error('[GET_ADMIN_INITIAL_ACTION]', error);

    return {
      stripeBalances: {
        available: [],
        pending: [],
      },
      stripeTransactions: [],
    };
  }
};
