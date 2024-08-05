'use client';

import { CheckCircle } from 'lucide-react';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { capitalize } from '@/lib/utils';

import { TextBadge } from '../common/text-badge';
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from '../ui';

type SubscriptionModalProps = {
  children: React.ReactNode;
};

export const SubscriptionModal = ({ children }: SubscriptionModalProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isFetching, setIsFetching] = useState(false);
  const [currentTab, setCurrentTab] = useState('yearly');

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={() => {}}>
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold">
              {capitalize(currentTab)}
            </DialogTitle>
            <div className="flex items-baseline justify-center pt-4">
              <p className="text-center text-4xl lg:text-5xl font-semibold tracking-tight">$24</p>
              <span className="text-sm leading-7 text-muted-foreground">/mo</span>
            </div>
          </DialogHeader>
          <Tabs
            defaultValue="unread"
            className="w-full pt-4"
            onValueChange={(value) => setCurrentTab(value)}
            value={currentTab}
          >
            <TabsList className="w-full">
              <TabsTrigger className="w-full" value="yearly">
                Yearly
              </TabsTrigger>
              <TabsTrigger className="w-full" value="monthly">
                Monthly
              </TabsTrigger>
            </TabsList>
            {currentTab === 'yearly' && (
              <div className="mt-6 w-full text-center">
                <TextBadge variant="lime" label="The best choice!" />
              </div>
            )}
            <TabsContent value="yearly" className="pt-4">
              <ul className="pt-2 space-y-3 text-sm leading-6">
                <li className="flex gap-x-3 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Full access to all courses
                </li>
                <li className="flex gap-x-3 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Full access to all courses
                </li>
                <li className="flex gap-x-3 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Full access to all courses
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="monthly" className="pt-4">
              <ul className="pt-2 space-y-3 text-sm leading-6">
                <li className="flex gap-x-3 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Full access to all courses
                </li>
                <li className="flex gap-x-3 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Full access to all courses
                </li>
                <li className="flex gap-x-3 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Full access to all courses
                </li>
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
