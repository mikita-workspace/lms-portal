'use client';

import { Button } from '../ui';

export const PremiumBanner = () => {
  return (
    <div className="border rounded-sm flex flex-col p-4 gap-y-2">
      <h2 className="font-semibold tracking-tight text-base">Upgrade to Premium</h2>
      <p className="text-muted-foreground text-sm">
        Unlock premium courses, get access to Nova AI, and more.
      </p>
      <Button size="sm">Upgrade</Button>
    </div>
  );
};
