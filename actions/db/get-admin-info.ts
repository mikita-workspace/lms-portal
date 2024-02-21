'use server';

import { stripe } from '@/server/stripe';

export const getAdminInfo = async () => {
  try {
    const stripeBalance = await stripe.balance.retrieve();
    const stripeTransaction = await stripe.balanceTransactions.list({ limit: 100 });
    const stripeCoupons = await stripe.coupons.list();
    const stripePromotionCodes = await stripe.promotionCodes.list();

    return {
      stripeCoupons: stripeCoupons.data.map((dt) => ({
        ...dt,
        promotionCodes: stripePromotionCodes.data.filter((promo) => promo.coupon.id === dt.id),
      })),
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
      stripeCoupons: [],
      stripeBalances: {
        available: [],
        pending: [],
      },
      stripeTransactions: [],
    };
  }
};
