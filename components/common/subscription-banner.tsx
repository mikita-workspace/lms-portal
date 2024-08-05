'use client';

import { SubscriptionModal } from '../modals/subscription-modal';
import { Button } from '../ui';

export const SubscriptionBanner = () => {
  return (
    <div className="border rounded-sm flex flex-col p-4 gap-y-2">
      <h2 className="font-semibold tracking-tight text-base">Upgrade to Nova Plus</h2>
      <p className="text-muted-foreground text-sm mb-2">
        Unlock premium courses, get access to Nova AI, and more.
      </p>
      <SubscriptionModal>
        <Button size="sm">Upgrade</Button>
      </SubscriptionModal>
    </div>
  );
};
