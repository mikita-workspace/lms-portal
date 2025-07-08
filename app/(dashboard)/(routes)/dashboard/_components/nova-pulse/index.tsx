'use client';

import { Info } from 'lucide-react';

import { TextBadge } from '@/components/common/text-badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui';
import { useCurrentUser } from '@/hooks/use-current-user';

import { TimeMetric } from './time-metric';
import { TotalCard } from './total-card';

export const NovaPulse = () => {
  const { user } = useCurrentUser();

  return (
    <div className="flex flex-col gap-y-2">
      <div className="mb-4 px-2">
        <div className="flex justify-between items-center">
          <h2 className="font-medium mb-2">Welcome back, {user?.name} 👋</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <p className="flex gap-x-2 text-muted-foreground items-center text-xs">
                  Nova Pulse
                  <Info className="h-4 w-4" />
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>The information is updated every hour</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex gap-x-2">
          <TextBadge label={String(2000) + ' Points'} variant="yellow" />
          {user?.hasSubscription && <TextBadge label="Nova&nbsp;Plus" variant="lime" />}
        </div>
      </div>
      <div className="flex gap-4 md:flex-row flex-col">
        <div className="flex flex-col gap-y-4">
          <TotalCard type="time" />
          <TotalCard type="money" />
        </div>
        <TimeMetric />
      </div>
    </div>
  );
};
