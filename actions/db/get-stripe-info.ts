'use server';

import { stripe } from '@/server/stripe';

export const getStripeInfo = async () => {
  try {
    const stripeBalance = await stripe.balance.retrieve();
    const stripeTransaction = await stripe.balanceTransactions.list({ limit: 100 });
    const stripeCoupons = await stripe.coupons.list();
    const stripePromotionCodes = await stripe.promotionCodes.list();

    // const t = await stripe.accounts.create({
    //   metadata: {
    //     name: 'dddddfdfdfdf',
    //     userId: 'sdfsfd',
    //   },
    //   type: 'express',
    //   country: 'US',
    //   email: 'mikita_kandratsyeu1@epam.com',
    //   settings: {
    //     payouts: {
    //       schedule: {
    //         interval: 'manual',
    //       },
    //     },
    //   },
    // });

    // console.log(t);

    // const accountLink = await stripe.accountLinks.create({
    //   account: 'acct_1OqshzR4orVU4SAg',
    //   refresh_url: 'https://nova-lms-portal.vercel.app/teacher/analytics',
    //   return_url: 'https://nova-lms-portal.vercel.app/teacher/analytics',
    //   type: 'account_onboarding',
    // });

    // console.log(accountLink);

    // const transfer = await stripe.transfers.create({
    //   amount: 400,
    //   currency: 'usd',
    //   destination: 'acct_1OqshzR4orVU4SAg',
    // });

    // console.log(transfer);

    // const loginLink = await stripe.accounts.createLoginLink('acct_1OqshzR4orVU4SAg');

    // console.log(loginLink);

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
    console.error('[GET_STRIPE_INFO_ACTION]', error);

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
