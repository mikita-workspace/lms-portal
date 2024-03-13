import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { DEFAULT_LOCALE } from '@/constants/locale';
import { PromoStatus } from '@/constants/payments';
import { db } from '@/lib/db';
import { formatPrice, getConvertedPrice } from '@/lib/format';
import { isOwner } from '@/lib/owner';
import { stripe } from '@/server/stripe';

export const POST = async (req: NextRequest) => {
  try {
    const user = await getCurrentUser();

    if (!user || !isOwner(user.userId)) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const { codeId, ...other } = await req.json();

    const action = req.nextUrl.searchParams.get('action');

    if (action === PromoStatus.DECLINED && codeId) {
      const stripePromotion = await stripe.promotionCodes.update(codeId, { active: false });

      const promotionCode = await db.stripePromo.update({
        where: { stripePromoId: stripePromotion.id },
        data: {
          isActive: false,
        },
      });

      return NextResponse.json(promotionCode);
    }

    if (action === PromoStatus.NEW) {
      const payload = {
        coupon: other.couponId,
        code: other.code,
        max_redemptions: other?.limitNumberOfRedeemed ? other.numberOfRedeemed : undefined,
        customer: other.limitToSpecificCustomer && other.customerId ? other.customerId : undefined,
        restrictions: {
          first_time_transaction: other.firstTimePurchase,
          ...(other.requireMinimumAmount && {
            minimum_amount: other.minAmount,
            minimum_amount_currency: other.minAmountCurrency,
          }),
        },
      } as Stripe.PromotionCodeCreateParams;

      const stripePromotion = await stripe.promotionCodes.create(payload);

      const promotionCode = await db.stripePromo.create({
        data: {
          code: other.code,
          stripeCouponId: other.couponId,
          stripePromoId: stripePromotion.id,
        },
      });

      return NextResponse.json(promotionCode);
    }

    //   await db.notification.create({
    //     data: {
    //       userId: payoutRequest.connectAccount.userId,
    //       title: `Payout Request #${payoutRequest.id}`,
    //       body: `The payout request has been successfully completed. ${formatPrice(getConvertedPrice(updatedPayoutRequest.amount), { locale: DEFAULT_LOCALE, currency: updatedPayoutRequest.currency })} was transferred to your Stripe account.`,
    //     },
    //   });

    return new NextResponse(ReasonPhrases.BAD_REQUEST, { status: StatusCodes.BAD_REQUEST });
  } catch (error) {
    console.error('[PAYMENTS_PROMO]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
