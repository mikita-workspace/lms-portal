'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import { Progress } from '../ui';

type ProgressBarProps = {
  showText?: boolean;
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

export const ProgressBar = ({
  showText = false,
  size = 'default',
  value,
  variant = 'default',
}: ProgressBarProps) => {
  const t = useTranslations('courses.progress');

  return (
    <div>
      <Progress className="h-2" value={value} variant={variant} />
      {showText && (
        <p
          className={cn(
            'font-medium mt-2 text-blue-700/85 dark:text-blue-400',
            colorByVariant[variant || 'default'],
            sizeByVariant[size || 'default'],
          )}
        >
          {Math.round(value)}% {t('complete')}
        </p>
      )}
    </div>
  );
};
