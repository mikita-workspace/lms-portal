'use server';

import { Course, Purchase, PurchaseDetails, User } from '@prisma/client';
import { getUnixTime } from 'date-fns';
import Stripe from 'stripe';

import { DEFAULT_CURRENCY } from '@/constants/locale';

export type Transaction = {
  amount: number;
  billingDetails: Stripe.Charge.BillingDetails;
  currency: string;
  id: string;
  paymentMethod: {
    brand?: string | null;
    country?: string | null;
    expMonth?: number | null;
    expYear?: number | null;
    last4?: string | null;
  } | null;
  purchaseDate: number;
  receiptUrl: string | null;
  title: string;
};

export type PurchaseWithCourse = Purchase & { course: Course } & {
  details: PurchaseDetails | null;
};

export const getTransactions = async (
  charges: Stripe.Response<Stripe.ApiList<Stripe.Charge>>['data'],
  purchases: PurchaseWithCourse[],
  users: User[],
) => {
  const userCharges = charges.reduce<Transaction[]>((userCharges, ch) => {
    const purchaseWithPaymentIntent = purchases.find(
      (pc) => pc.details?.paymentIntent === ch.payment_intent,
    );

    if (purchaseWithPaymentIntent) {
      userCharges.push({
        amount: ch.amount,
        billingDetails: ch.billing_details,
        currency: ch.currency,
        id: ch.id,
        paymentMethod: {
          brand: ch.payment_method_details?.card?.brand,
          country: ch.payment_method_details?.card?.country,
          expMonth: ch.payment_method_details?.card?.exp_month,
          expYear: ch.payment_method_details?.card?.exp_year,
          last4: ch.payment_method_details?.card?.last4,
        },
        purchaseDate: ch.created,
        receiptUrl: ch.receipt_url,
        title: purchaseWithPaymentIntent.course.title,
      });
    }

    return userCharges;
  }, []);

  const userFreePurchases = purchases.reduce<Transaction[]>((userFreePurchases, pc) => {
    const user = users.find((user) => user.id === pc.userId);

    if (pc.details?.price === 0) {
      userFreePurchases.push({
        amount: 0,
        billingDetails: {
          name: user?.name ?? null,
          address: null,
          email: user?.email ?? null,
          phone: null,
        },
        currency: DEFAULT_CURRENCY,
        id: pc.id,
        paymentMethod: null,
        purchaseDate: getUnixTime(pc.createdAt),
        receiptUrl: null,
        title: pc.course.title,
      });
    }

    return userFreePurchases;
  }, []);
  return [...userCharges, ...userFreePurchases].sort((a, b) => b.purchaseDate - a.purchaseDate);
};
