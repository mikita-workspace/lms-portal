'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { MdVerified } from 'react-icons/md';
import Stripe from 'stripe';

import { getAnalytics } from '@/actions/analytics/get-analytics';
import { CreditCardInfo } from '@/components/common/credit-card-info';
import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from '@/constants/locale';
import { useCurrentUser } from '@/hooks/use-current-user';
import { formatPrice, getConvertedPrice } from '@/lib/format';

type Analytics = Awaited<ReturnType<typeof getAnalytics>>;

type BalanceAmountProps = {
  stripeConnect: Analytics['stripeConnect'];
};

export const BalanceAmount = ({ stripeConnect }: BalanceAmountProps) => {
  const { user } = useCurrentUser();

  const [showBalance, setShowBalance] = useState(false);

  const handleShowBalance = () => setShowBalance((prev) => !prev);

  const creditCard = stripeConnect?.externalAccounts?.data?.find(
    (ea) => ea.object === 'card',
  ) as Stripe.Card;

  const bankAccount = stripeConnect?.externalAccounts?.data?.find(
    (ea) => ea.object === 'bank_account',
  ) as Stripe.BankAccount;

  return (
    <div className="flex flex-col gap-2 w-full md:w-auto">
      <div className="flex gap-4 items-center">
        <button onClick={handleShowBalance}>
          {showBalance && <Eye className="h-4 w-4" />}
          {!showBalance && <EyeOff className="h-4 w-4" />}
        </button>
        <div className="text-2xl font-bold min-h-[32px] flex items-center">
          {showBalance && (
            <span>
              {formatPrice(getConvertedPrice(stripeConnect?.balance?.available ?? 0), {
                locale: DEFAULT_LOCALE,
                currency: stripeConnect?.currency ?? DEFAULT_CURRENCY,
              })}
            </span>
          )}
          {!showBalance && (
            <div className="flex gap-2">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="rounded-full w-[10px] h-[10px] bg-primary text-2xl"
                ></div>
              ))}
            </div>
          )}
        </div>
      </div>
      {stripeConnect && stripeConnect.isActive && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <p className="text-sm font-semibold">
                {stripeConnect?.metadata?.['name'] ?? user?.name}
              </p>
              <MdVerified className="h-3 w-3 text-green-500" />
            </div>
            <p className="text-xs leading-none text-muted-foreground">{stripeConnect.email}</p>
          </div>
          {creditCard && (
            <CreditCardInfo
              brand={creditCard.brand}
              expMonth={creditCard.exp_month}
              expYear={creditCard.exp_year}
              last4={creditCard.last4}
            />
          )}
          {bankAccount && (
            <div className="flex flex-col text-sm">
              <p className="font-semibold">{bankAccount.bank_name}</p>
              <span className="text-xs text-muted-foreground">{bankAccount.routing_number}</span>
              <span className="text-xs text-muted-foreground">****{bankAccount.last4}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
