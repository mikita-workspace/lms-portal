'use client';

import { ExternalLink, Eye, EyeOff, HandCoins } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { MdVerified } from 'react-icons/md';

import { getAnalytics } from '@/actions/analytics/get-analytics';
import { Button, Card, CardContent } from '@/components/ui';
import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from '@/constants/locale';
import { useCurrentUser } from '@/hooks/use-current-user';
import { fetcher } from '@/lib/fetcher';
import { formatPrice } from '@/lib/format';

type Analytics = Awaited<ReturnType<typeof getAnalytics>>;

type StripeConnectProps = {
  stripeConnect: Analytics['stripeConnect'];
};

export const StripeConnect = ({ stripeConnect }: StripeConnectProps) => {
  const { user } = useCurrentUser();

  const [showBalance, setShowBalance] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const handleShowBalance = () => setShowBalance((prev) => !prev);

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

          window.open(data.url, '_blank');

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
          <div className="pt-6 flex flex-col md:flex-row gap-4 items-center md:justify-between">
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <div className="flex gap-4 items-center">
                <button onClick={handleShowBalance}>
                  {showBalance && <Eye className="h-4 w-4" />}
                  {!showBalance && <EyeOff className="h-4 w-4" />}
                </button>
                <div className="text-2xl font-bold min-h-[32px] flex items-center">
                  {showBalance && (
                    <span>
                      {formatPrice(stripeConnect?.balance?.available ?? 0, {
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
              {stripeConnect && (
                <div className="flex flex-col gap-1">
                  <div className="flex gap-1 items-center">
                    <p className="text-sm font-semibold">
                      {stripeConnect?.metadata?.['name'] ?? user?.name}
                    </p>
                    <MdVerified className="h-3 w-3 text-green-500" />
                  </div>
                  <p className="text-xs leading-none text-muted-foreground">
                    {stripeConnect.email}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:gap-2 items-center w-full md:w-auto">
              {!stripeConnect && (
                <Button className="w-full" disabled={isFetching} onClick={handleCreateAccount}>
                  Create Stripe Connect
                </Button>
              )}
              {stripeConnect && (
                <div className="flex flex-col gap-2 w-full">
                  <Button disabled={isFetching} className="w-full">
                    <HandCoins className="h-4 w-4 mr-2" />
                    <span>Request a payout</span>
                  </Button>
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
        </CardContent>
      </Card>
    </div>
  );
};
