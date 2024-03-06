'use client';

import { useEffect, useState } from 'react';

import { getAnalytics } from '@/actions/analytics/get-analytics';
import { Card, CardContent, Skeleton } from '@/components/ui';

import { Actions } from './actions';
import { BalanceTransactions } from './balance-transactions';

type Analytics = Awaited<ReturnType<typeof getAnalytics>>;

type StripeConnectProps = {
  stripeConnect: Analytics['stripeConnect'];
  stripeConnectPayout: Analytics['stripeConnectPayouts'];
};

export const StripeConnect = ({ stripeConnect, stripeConnectPayout }: StripeConnectProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Skeleton className="h-[120px] w-full mb-8" />;
  }

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex flex-col gap-1">
        <p className="font-medium text-xl">Stripe Connect</p>
        <p className="text-xs text-muted-foreground">
          Your available balance in the{' '}
          <span className="text-blue-500 font-semibold">Stripe Connect</span>
        </p>
      </div>
      <Card className="shadow-none">
        <CardContent>
          <Actions stripeConnect={stripeConnect} />
          {stripeConnect && <BalanceTransactions stripeConnectPayout={stripeConnectPayout} />}
        </CardContent>
      </Card>
    </div>
  );
};
