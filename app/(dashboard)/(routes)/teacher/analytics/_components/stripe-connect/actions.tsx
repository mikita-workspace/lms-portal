'use client';

import { Download, ExternalLink, HandCoins } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { getAnalytics } from '@/actions/analytics/get-analytics';
import { ReportModal } from '@/components/modals/report-modal';
import { RequestPayoutModal } from '@/components/modals/request-payout-modal';
import { Button } from '@/components/ui';
import { Report } from '@/constants/payments';
import { useCurrentUser } from '@/hooks/use-current-user';
import { fetcher } from '@/lib/fetcher';

import { BalanceAmount } from './balance-amount';

type Analytics = Awaited<ReturnType<typeof getAnalytics>>;

type ActionsProps = {
  disableRequest?: boolean;
  stripeConnect: Analytics['stripeConnect'];
  totalProfit: Analytics['totalProfit'];
};

export const Actions = ({ disableRequest = false, stripeConnect, totalProfit }: ActionsProps) => {
  const { user } = useCurrentUser();

  const [isFetching, setIsFetching] = useState(false);

  const handleCreateAccount = async () => {
    setIsFetching(true);

    await toast.promise(
      fetcher.post(`/api/payments/stripe-connect/${user?.userId}/create`, {
        responseType: 'json',
      }),
      {
        loading: 'Creating an account...',
        success: (data) => {
          setIsFetching(false);

          window.location.assign(data.url);

          return 'Stripe Onboarding';
        },
        error: () => {
          setIsFetching(false);

          return 'Something went wrong';
        },
      },
    );
  };

  const handleLoginAccount = async () => {
    setIsFetching(true);

    await toast.promise(
      fetcher.post(`/api/payments/stripe-connect/${user?.userId}/login`, {
        responseType: 'json',
      }),
      {
        loading: 'Logging to your account...',
        success: (data) => {
          setIsFetching(false);

          window.location.assign(data.url);

          return 'Stripe Express';
        },
        error: () => {
          setIsFetching(false);

          return 'Something went wrong';
        },
      },
    );
  };

  return (
    <div className="pt-6 flex flex-col md:flex-row gap-4 items-center md:justify-between">
      <BalanceAmount stripeConnect={stripeConnect} />
      <div className="flex flex-col md:flex-row gap-3 md:gap-2 items-center w-full md:w-auto">
        {!stripeConnect ||
          (!stripeConnect?.isActive && (
            <Button className="w-full" disabled={isFetching} onClick={handleCreateAccount}>
              {!stripeConnect && <span> Create Stripe Connect</span>}
              {!stripeConnect?.isActive && <span>Continue creating an account</span>}
            </Button>
          ))}
        {stripeConnect && stripeConnect.isActive && (
          <div className="flex flex-col gap-2 w-full">
            <RequestPayoutModal stripeConnect={stripeConnect} totalProfit={totalProfit}>
              <Button
                disabled={isFetching || !totalProfit?.availableForPayout || disableRequest}
                className="w-full"
              >
                <HandCoins className="h-4 w-4 mr-2" />
                <span>Request a payout</span>
              </Button>
            </RequestPayoutModal>
            <ReportModal reportType={Report.CONNECT} stripeConnect={stripeConnect}>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download report
              </Button>
            </ReportModal>
            <Button
              disabled={isFetching}
              onClick={handleLoginAccount}
              variant="outline"
              className="w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              <span>Stripe Express</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
