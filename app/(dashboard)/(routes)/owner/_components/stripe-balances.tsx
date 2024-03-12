'use client';

import { Download } from 'lucide-react';
import CountUp from 'react-countup';

import { getStripeDetails } from '@/actions/stripe/get-stripe-details';
import { ReportModal } from '@/components/modals/report-modal';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from '@/constants/locale';
import { Report } from '@/constants/payments';
import { getConvertedPrice, getCurrencySymbol } from '@/lib/format';
import { capitalize } from '@/lib/utils';

type StripeDetails = Awaited<ReturnType<typeof getStripeDetails>>;

type StripeBalancesProps = {
  balances: StripeDetails['balances'];
  owner: StripeDetails['owner'];
};

export const StripeBalances = ({ balances, owner }: StripeBalancesProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-2">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-xl">
            {owner?.dashboard?.display_name ?? 'Stripe Balances'}
          </p>
          <span className="text-xs text-muted-foreground">
            The balance of all sales using service
          </span>
        </div>
        <ReportModal reportType={Report.OWNER}>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download report
          </Button>
        </ReportModal>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        {Object.keys(balances).map((key) => {
          const balance = balances[key as keyof typeof balances];

          return (
            <Card key={key} className="shadow-none">
              <CardHeader className="flex flex-col justify-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{capitalize(key)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 mt-2">
                  <CountUp
                    className="text-2xl font-bold"
                    decimals={2}
                    duration={2.75}
                    end={getConvertedPrice(balance)}
                    prefix={`${getCurrencySymbol(DEFAULT_LOCALE, DEFAULT_CURRENCY)} `}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
