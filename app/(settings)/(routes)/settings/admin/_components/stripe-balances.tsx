'use client';

import { format, fromUnixTime } from 'date-fns';
import CountUp from 'react-countup';

import { getAdminInfo } from '@/actions/db/get-admin-info';
import { Card, CardContent, CardHeader, CardTitle, ScrollArea } from '@/components/ui';
import { DEFAULT_LOCALE } from '@/constants/locale';
import { formatPrice, getConvertedPrice, getCurrencySymbol } from '@/lib/format';
import { capitalize } from '@/lib/utils';

type AdminInfo = Awaited<ReturnType<typeof getAdminInfo>>;

type StripeBalancesProps = {
  balances: AdminInfo['stripeBalances'];
  transactions: AdminInfo['stripeTransactions'];
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
                        end={getConvertedPrice(bl.amount)}
                        prefix={`${getCurrencySymbol(DEFAULT_LOCALE, bl.currency.toUpperCase())} `}
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
            <CardTitle className="text-sm font-medium">Last 100 Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2 flex items-center">
              <span>
                {formatPrice(
                  transactions.reduce((total, current) => total + current.net, 0) / 100,
                  {
                    locale: DEFAULT_LOCALE,
                    currency: transactions[0].currency,
                  },
                )}
              </span>
              <span className="text-base font-normal">&nbsp;+&nbsp;</span>
              <span className="text-2xl font-normal">
                {formatPrice(
                  transactions.reduce((total, current) => total + current.fee, 0) / 100,
                  {
                    locale: DEFAULT_LOCALE,
                    currency: transactions[0].currency,
                  },
                )}
                <span className="text-base">&nbsp;Fees</span>
              </span>
            </div>
            <p className="text-sm font-medium mb-2">Details:</p>
            <ScrollArea className="w-full h-[240px]">
              <div className="text-xs pr-4">
                {transactions.map((tn) => {
                  return (
                    <div
                      key={tn.id}
                      className="flex justify-between border-b last:border-none py-1"
                    >
                      <div className="flex flex-col gap-1">
                        <p className="font-bold">
                          {formatPrice(tn.amount / 100, {
                            locale: DEFAULT_LOCALE,
                            currency: tn.currency,
                          })}
                        </p>
                        <p>
                          <span>
                            {formatPrice(tn.net / 100, {
                              locale: DEFAULT_LOCALE,
                              currency: tn.currency,
                            })}
                          </span>
                          &nbsp;+&nbsp;
                          <span>
                            {formatPrice(tn.fee / 100, {
                              locale: DEFAULT_LOCALE,
                              currency: tn.currency,
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
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
