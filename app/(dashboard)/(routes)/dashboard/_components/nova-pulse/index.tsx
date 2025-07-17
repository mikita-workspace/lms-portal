'use client';

import { Info } from 'lucide-react';

import { getNovaPulse } from '@/actions/nova-pulse/get-nova-pulse';
import { TextBadge } from '@/components/common/text-badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui';
import { useCurrentUser } from '@/hooks/use-current-user';

import { Heatmap } from './heat-map';
import { TotalCard } from './total-card';

type NovaPulseProps = {
  info: Awaited<ReturnType<typeof getNovaPulse>>;
};

export const NovaPulse = ({ info }: NovaPulseProps) => {
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
          <TextBadge label={info.summary.title} variant="indigo" />
          <TextBadge label={String(info.xp) + ' Points'} variant="yellow" />
        </div>
      </div>
      <div className="flex gap-4 flex-col">
        <Heatmap data={info.heatMap} summary={info.summary} />
        <div className="flex gap-4 flex-col md:flex-row">
          <TotalCard info={info} type="time" />
          <TotalCard info={info} type="money" />
        </div>
      </div>
    </div>
  );
};
