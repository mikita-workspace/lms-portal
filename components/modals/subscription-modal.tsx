'use client';

import { StripeSubscriptionDescription, StripeSubscriptionPeriod } from '@prisma/client';
import { CheckCircle2 as CheckCircle } from 'lucide-react';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { capitalize } from '@/lib/utils';

import { Price } from '../common/price';
import { TextBadge } from '../common/text-badge';
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '../ui';

type SubscriptionModalProps = {
  description: StripeSubscriptionDescription[];
  open: boolean;
  setOpen: (value: boolean) => void;
};

export const SubscriptionModal = ({ description = [], open, setOpen }: SubscriptionModalProps) => {
  const [isFetching, setIsFetching] = useState(false);
  const [currentTab, setCurrentTab] = useState<StripeSubscriptionPeriod>(
    StripeSubscriptionPeriod.yearly,
  );

  const yearly = description.find(({ period }) => period === StripeSubscriptionPeriod.yearly);
  const monthly = description.find(({ period }) => period === StripeSubscriptionPeriod.monthly);
  const price = currentTab === StripeSubscriptionPeriod.yearly ? yearly?.price : monthly?.price;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={() => {}}>
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold">
              {capitalize(currentTab)}
            </DialogTitle>
            <div className="flex items-baseline justify-center pt-4">
              <p className="text-center text-3xl lg:text-4xl font-semibold tracking-tight">
                <Price price={price ?? 0} />
              </p>
              <span className="text-sm leading-7 text-muted-foreground ml-1">/mo</span>
            </div>
          </DialogHeader>
          <Tabs
            defaultValue={StripeSubscriptionPeriod.yearly}
            className="w-full pt-4"
            onValueChange={(value) => setCurrentTab(value as StripeSubscriptionPeriod)}
            value={currentTab}
          >
            <TabsList className="w-full">
              <TabsTrigger className="w-full" value={StripeSubscriptionPeriod.yearly}>
                {capitalize(yearly?.period ?? '')}
              </TabsTrigger>
              <TabsTrigger className="w-full" value={StripeSubscriptionPeriod.monthly}>
                {capitalize(monthly?.period ?? '')}
              </TabsTrigger>
            </TabsList>
            {currentTab === StripeSubscriptionPeriod.yearly && (
              <div className="mt-6 w-full text-center">
                <TextBadge variant="lime" label="The best choice!" />
              </div>
            )}
            <TabsContent value={StripeSubscriptionPeriod.yearly} className="pt-4">
              <ul className="pt-2 space-y-3 text-sm leading-6">
                {yearly?.points.map((point) => (
                  <li key={point} className="flex gap-x-3 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    {point}
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value={StripeSubscriptionPeriod.monthly} className="pt-4">
              <ul className="pt-2 space-y-3 text-sm leading-6">
                {monthly?.points.map((point) => (
                  <li key={point} className="flex gap-x-3 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    {point}
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
          <DialogFooter className="mt-6">
            <Button
              className="mt-2 w-full"
              disabled={isFetching}
              isLoading={isFetching}
              type="submit"
            >
              Upgrade
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
