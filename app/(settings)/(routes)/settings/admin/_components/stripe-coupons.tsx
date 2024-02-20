'use client';

import { format, fromUnixTime } from 'date-fns';
import Link from 'next/link';

import { getAdminInfo } from '@/actions/db/get-admin-info';
import { TextBadge } from '@/components/common/text-badge';
import { STRIPE_COUPONS_URL } from '@/constants/common';
import { Currency, Locale } from '@/constants/locale';
import { formatPrice } from '@/lib/format';

type StripeCouponsProps = {
  coupons: Awaited<ReturnType<typeof getAdminInfo>>['stripeCoupons'];
};

export const StripeCoupons = ({ coupons }: StripeCouponsProps) => {
  return (
    <div className="flex flex-col gap-4  mt-8">
      <div className="flex flex-col gap-1">
        <p className="font-medium text-xl">Stripe Coupons</p>
        <span className="text-xs text-muted-foreground">
          Here you can view coupons and manage promo codes. You can create coupons and promo codes
          on{' '}
          <Link
            className="hover:underline text-blue-500 font-semibold"
            href={STRIPE_COUPONS_URL}
            target="_blank"
          >
            Stripe
          </Link>
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {coupons.map((cp) => {
          const term = (() => {
            if (cp.amount_off) {
              return `${formatPrice(cp.amount_off / 100, { locale: Locale.EN_US, currency: cp.currency as Currency })} off ${cp.duration_in_months ? `for ${cp.duration_in_months} months` : 'forever'}`;
            }

            if (cp.percent_off) {
              return `${cp.percent_off}% off ${cp.duration_in_months ? `for ${cp.duration_in_months} months` : 'forever'}`;
            }

            return '';
          })();
          return (
            <div key={cp.id} className="flex flex-col gap-2 border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <span className="font-bold">{cp.name}</span>
                    {cp.valid && <TextBadge label="Active" variant="green" />}
                    {!cp.valid && <TextBadge label="Inactive" variant="red" />}
                  </div>
                  <span className="text-xs">{term}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                {cp.promotionCodes.map((promo) => (
                  <div
                    key={promo.id}
                    className="flex gap-2 text-sm items-center border rounded-lg p-4 justify-between"
                  >
                    <div className="flex gap-2">
                      <span className="font-medium">#{promo.code}</span>|
                      <span>
                        Redemptions {promo.times_redeemed}/{promo.max_redemptions}
                      </span>
                      |
                      <span>
                        Created at {format(fromUnixTime(promo.created), 'HH:mm, dd MMM yyyy')}
                      </span>
                      {promo.active && <TextBadge label="Active" variant="green" />}
                      {!promo.active && <TextBadge label="Inactive" variant="red" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
