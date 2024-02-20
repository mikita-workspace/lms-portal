'use client';

import { format, fromUnixTime } from 'date-fns';
import CountUp from 'react-countup';
import Stripe from 'stripe';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Currency, Locale } from '@/constants/locale';
import { formatPrice, getCurrencySymbol } from '@/lib/format';
import { capitalize } from '@/lib/utils';

type StripeBalance = { amount: number; currency: string };

type StripeBalancesProps = {
  balances: {
    available: StripeBalance[];
    pending: StripeBalance[];
  };
  transactions: {
    amount: number;
    created: number;
    currency: string;
    fee: number;
    feeDetails: Stripe.BalanceTransaction.FeeDetail[];
    id: string;
    net: number;
    status: string;
    type: Stripe.BalanceTransaction.Type;
  }[];
};

export const StripeBalances = ({ balances, transactions }: StripeBalancesProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="font-medium text-xl">Stripe Balances</p>
        <span className="text-xs text-muted-foreground">
          The balance of all sales using service
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:grid-cols-3">
        <div className="flex flex-col gap-4 h-full justify-between">
          {Object.keys(balances).map((key) => {
            const balance = balances[key as keyof typeof balances];

            return (
              <Card key={key} className="shadow-none h-full">
                <CardHeader className="flex flex-col justify-center space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{capitalize(key)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2 mt-2">
                    {balance.map((bl, index) => (
                      <CountUp
                        key={index}
                        className="text-2xl font-bold"
                        decimals={2}
                        duration={2.75}
                        end={bl.amount / 100}
                        prefix={`${getCurrencySymbol(Locale.EN_US, bl.currency.toUpperCase() as Currency)} `}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <Card className="shadow-none xl:col-span-2">
          <CardHeader className="flex flex-col justify-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2 flex items-center">
              <span>
                {formatPrice(
                  transactions.reduce((total, current) => total + current.net, 0) / 100,
                  {
                    locale: Locale.EN_US,
                    currency: transactions[0].currency as Currency,
                  },
                )}
              </span>
              <span className="text-base font-normal">&nbsp;+&nbsp;</span>
              <span className="text-2xl font-normal">
                {formatPrice(
                  transactions.reduce((total, current) => total + current.fee, 0) / 100,
                  {
                    locale: Locale.EN_US,
                    currency: transactions[0].currency as Currency,
                  },
                )}
                <span className="text-base">&nbsp;Fees</span>
              </span>
            </div>
            <p className="text-sm font-medium mb-2">Details:</p>
            <div className="text-xs flex flex-col max-h-[240px] overflow-auto">
              {transactions.map((tn) => {
                return (
                  <div key={tn.id} className="flex justify-between border-b last:border-none py-1">
                    <div className="flex flex-col gap-1">
                      <p className="font-bold">
                        {formatPrice(tn.amount / 100, {
                          locale: Locale.EN_US,
                          currency: tn.currency as Currency,
                        })}
                      </p>
                      <p>
                        <span>
                          {formatPrice(tn.net / 100, {
                            locale: Locale.EN_US,
                            currency: tn.currency as Currency,
                          })}
                        </span>
                        &nbsp;+&nbsp;
                        <span>
                          {formatPrice(tn.fee / 100, {
                            locale: Locale.EN_US,
                            currency: tn.currency as Currency,
                          })}
                          &nbsp;Fees
                        </span>
                      </p>
                      <p>Type: {tn.type}</p>
                      <p>Status: {tn.status}</p>
                    </div>
                    <span className="text-right">
                      {format(fromUnixTime(tn.created), 'HH:mm, dd MMM yyyy')}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
