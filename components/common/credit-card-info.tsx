'use client';

import { PaymentIcon, PaymentTypeExtended } from 'react-svg-credit-card-payment-icons';

import { capitalize } from '@/lib/utils';

type CreditCardInfoProps = {
  brand?: string | null;
  expMonth?: number | null;
  expYear?: number | null;
  last4?: string | null;
};

export const CreditCardInfo = ({ brand, expMonth, expYear, last4 }: CreditCardInfoProps) => {
  return (
    <div className="flex gap-2 items-center">
      <PaymentIcon
        type={capitalize(brand || 'generic') as PaymentTypeExtended}
        format="flatRounded"
        width={50}
      />
      <div className="flex flex-col text-xs text-muted-foreground">
        <span>****{last4}</span>
        <span>
          {expMonth}/{expYear}
        </span>
      </div>
    </div>
  );
};
