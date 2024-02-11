'use client';

import { cn } from '@/lib/utils';

import { Progress } from '../ui';

type ProgressBarProps = {
  size?: 'default' | 'sm';
  value: number;
  variant?: 'default' | 'success';
};

const colorByVariant = {
  default: 'text-blue-700/85 dark:text-blue-400',
  success: 'text-emerald-700 dark:text-emerald-700',
};

const sizeByVariant = {
  default: 'text-sm',
  sm: 'text-xs',
};

export const ProgressBar = ({ size = 'default', value, variant = 'default' }: ProgressBarProps) => {
  return (
    <div>
      <Progress className="h-2" value={value} variant={variant} />
      <p
        className={cn(
          'font-medium mt-2 text-blue-700/85 dark:text-blue-400',
          colorByVariant[variant || 'default'],
          sizeByVariant[size || 'default'],
        )}
      >
        {Math.round(value)}% Complete
      </p>
    </div>
  );
};
