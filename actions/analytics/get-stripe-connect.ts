'use server';

import { PayoutRequest } from '@prisma/client';
import { getUnixTime } from 'date-fns';
import Stripe from 'stripe';

export const getStripeConnect = async (
  account: Stripe.Response<Stripe.Account> | null,
  balance: Stripe.Response<Stripe.Balance> | null,
) => {
  if (!account) {
    return null;
  }

  return {
    balance: {
      available: balance?.available?.reduce((acc, current) => acc + current.amount, 0) ?? 0,
      pending: balance?.pending?.reduce((acc, current) => acc + current.amount, 0) ?? 0,
    },
    country: account.country,
    created: account.created,
    currency: account.default_currency,
    email: account.email,
    externalAccounts: account.external_accounts,
    id: account.id,
    isActive: account.details_submitted,
    metadata: account.metadata,
    payouts: account.settings?.payouts,
    type: account.type,
  };
};

export const getStripeConnectPayouts = async (
  payouts: Stripe.Response<Stripe.ApiList<Stripe.BalanceTransaction>> | null,
  declinedPayouts: PayoutRequest[],
) => {
  const stripePayouts =
    payouts?.data?.map((py) => ({
      amount: py.amount,
      created: py.created,
      currency: py.currency,
      fee: py.fee,
      id: py.id,
      net: py.net,
      status: py.status,
      type: py.type,
    })) ?? [];

  const declined = declinedPayouts.map((dp) => ({
    amount: dp.amount,
    created: getUnixTime(dp.updatedAt),
    currency: dp.currency,
    fee: 0,
    id: dp.id,
    net: dp.amount,
    status: dp.status,
    type: 'Request',
  }));

  return [...stripePayouts, ...declined].sort((a, b) => b.created - a.created);
};
