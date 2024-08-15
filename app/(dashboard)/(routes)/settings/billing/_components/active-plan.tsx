'use client';

import { format } from 'date-fns';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { getUserSubscription } from '@/actions/stripe/get-user-subscription';
import { Banner } from '@/components/common/banner';
import { Button, Card, CardContent } from '@/components/ui';
import { TIMESTAMP_SUBSCRIPTION_TEMPLATE } from '@/constants/common';
import { fetcher } from '@/lib/fetcher';

type ActivePlanProps = {
  userSubscription: Awaited<ReturnType<typeof getUserSubscription>>;
};

export const ActivePlan = ({ userSubscription }: ActivePlanProps) => {
  const pathname = usePathname();

  const [isFetching, setIsFetching] = useState(false);

  const handleManageSubscription = async () => {
    setIsFetching(true);

    await toast.promise(
      fetcher.post('/api/payments/subscription', {
        body: {
          returnUrl: pathname,
        },
        responseType: 'json',
      }),
      {
        loading: 'Subscription processing...',
        success: (data) => {
          setIsFetching(false);

          window.location.assign(data.url);

          return 'Checkout';
        },
        error: () => {
          setIsFetching(false);

          return 'Something went wrong';
        },
      },
    );
  };
  return (
    <div className="flex flex-col gap-4">
      <p className="font-medium text-xl">Active Plan</p>
      {userSubscription?.cancelAt && (
        <Banner
          label={`Your subscription will be canceled and all resources will be stopped on ${format(userSubscription.endPeriod, TIMESTAMP_SUBSCRIPTION_TEMPLATE)}. Renew your subscription now to continue using Nova Plus.`}
          variant="warning"
        />
      )}
      {userSubscription && (
        <Card className="shadow-none rounded-sm">
          <CardContent>
            <div className="pt-6 flex flex-col justify-center space-y-2 mb-4">
              <p className="text-lg font-semibold">{userSubscription.planName}</p>
              <p className="text-sm">
                Your subscription will be {userSubscription?.cancelAt ? 'cancelled' : 'renewed'} on{' '}
                {format(userSubscription.endPeriod, TIMESTAMP_SUBSCRIPTION_TEMPLATE)}
              </p>
            </div>
            <Button disabled={isFetching} isLoading={isFetching} onClick={handleManageSubscription}>
              Manage Subscription
            </Button>
          </CardContent>
        </Card>
      )}
      {!userSubscription && (
        <div className="">
          <p className="text-sm">You do not have any active subscriptions.</p>
        </div>
      )}
    </div>
  );
};
