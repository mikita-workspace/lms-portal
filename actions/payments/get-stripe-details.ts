'use server';

import { stripe } from '@/server/stripe';

export const getStripeDetails = async () => {
  try {
    const stripeBalance = await stripe.balance.retrieve();
    const stripeCoupons = await stripe.coupons.list();
    const stripePromotionCodes = await stripe.promotionCodes.list();

    return {
      stripeCoupons: stripeCoupons.data.map((dt) => ({
        ...dt,
        promotionCodes: stripePromotionCodes.data.filter((promo) => promo.coupon.id === dt.id),
      })),
      balances: {
        available: stripeBalance?.available?.reduce((acc, current) => acc + current.amount, 0) ?? 0,
        pending: stripeBalance?.pending?.reduce((acc, current) => acc + current.amount, 0) ?? 0,
      },
    };
  } catch (error) {
    console.error('[GET_STRIPE_INFO_ACTION]', error);

    return {
      stripeCoupons: [],
      balances: {
        available: 0,
        pending: 0,
      },
      stripeTransactions: [],
    };
  }
};
