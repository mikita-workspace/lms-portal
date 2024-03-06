'use client';

import { getAnalytics } from '@/actions/analytics/get-analytics';
import { Card, CardContent } from '@/components/ui';

import { Actions } from './actions';
import { BalanceTransactions } from './balance-transactions';

type Analytics = Awaited<ReturnType<typeof getAnalytics>>;

type StripeConnectProps = {
  hasActivePayouts?: boolean;
  stripeConnect: Analytics['stripeConnect'];
  stripeConnectPayout: Analytics['stripeConnectPayouts'];
  totalProfit: Analytics['totalProfit'];
};

export const StripeConnect = ({
  hasActivePayouts,
  stripeConnect,
  stripeConnectPayout,
  totalProfit,
}: StripeConnectProps) => {
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
          <Actions
            stripeConnect={stripeConnect}
            totalProfit={totalProfit}
            disableRequest={hasActivePayouts}
          />
          {stripeConnect && <BalanceTransactions stripeConnectPayout={stripeConnectPayout} />}
        </CardContent>
      </Card>
    </div>
  );
};
