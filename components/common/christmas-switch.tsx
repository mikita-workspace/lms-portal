'use client';

import Image from 'next/image';

import { useChristmasStore } from '@/hooks/store/use-christmas-store';
import { cn } from '@/lib/utils';

import { Switch } from '../ui';

type ChristmasSwitchProps = {
  className?: string;
};

export const ChristmasSwitch = ({ className }: ChristmasSwitchProps) => {
  const { isEnabled, onEnable } = useChristmasStore((state) => ({
    isEnabled: state.isEnabled,
    onEnable: state.onEnable,
  }));

  return (
    <div className={cn(className, 'flex items-center gap-x-4')}>
      <Switch
        aria-readonly
        checked={isEnabled}
        onCheckedChange={() => onEnable(!isEnabled)}
        type="submit"
      />
      <div className="flex items-center gap-x-1">
        <Image
          src="/assets/christmas-tree.png"
          height={16}
          width={16}
          priority
          alt="Christmas Tree"
        />
        <Image
          src="/assets/christmas-gift.png"
          height={16}
          width={16}
          priority
          alt="Christmas Tree"
        />
      </div>
    </div>
  );
};
