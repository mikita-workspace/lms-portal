'use client';

import { StripeSubscriptionDescription } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useToast } from '@/components/ui/use-toast';
import { fetcher } from '@/lib/fetcher';

import { SubscriptionModal } from '../modals/subscription-modal';
import { Button } from '../ui';

export const SubscriptionBanner = () => {
  const t = useTranslations('subscription');

  const { toast } = useToast();

  const [subscriptionDescription, setSubscriptionDescription] = useState<
    StripeSubscriptionDescription[]
  >([]);
  const [isFetching, setIsFetching] = useState(false);
  const [open, setOpen] = useState(false);

  const handleFetchSubscriptionDescription = async () => {
    setIsFetching(true);

    try {
      const response = await fetcher.get('/api/payments/subscription', {
        responseType: 'json',
      });

      if (!response) {
        setSubscriptionDescription([]);
      }

      setSubscriptionDescription(response);
      setOpen(true);
    } catch (error) {
      toast({ isError: true });
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <>
      <SubscriptionModal description={subscriptionDescription} open={open} setOpen={setOpen} />
      <div className="border rounded-lg flex flex-col p-4 gap-y-2">
        <h2 className="font-semibold tracking-tight text-base">{t('bannerTitle')}</h2>
        <p className="text-muted-foreground text-sm mb-2">{t('bannerBody')}</p>
        <Button
          disabled={isFetching}
          isLoading={isFetching}
          onClick={handleFetchSubscriptionDescription}
          size="sm"
        >
          {t('upgrade')}
        </Button>
      </div>
    </>
  );
};
