import { cva, type VariantProps } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

const backgroundVariants = cva('rounded-full flex items-center justify-center', {
  variants: {
    variant: {
      default: 'bg-blue-500/15',
      success: 'bg-emerald-100 dark:bg-emerald-700',
    },
    iconVariant: {
      default: 'text-blue-700/85 dark:text-blue-400',
      success: 'text-emerald-700 dark:text-emerald-100',
    },
    size: {
      default: 'p-2',
      sm: 'p-1',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const iconVariants = cva('', {
  variants: {
    variant: {
      default: 'text-blue-700/85 dark:text-blue-400',
      success: 'text-emerald-700 dark:text-emerald-100',
    },
    size: {
      default: 'h-8 w-8',
      sm: 'h-3 w-3',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

type BackgroundVariantsProps = VariantProps<typeof backgroundVariants>;
type IconVariantsProps = VariantProps<typeof iconVariants>;

interface IconBadgeProps extends BackgroundVariantsProps, IconVariantsProps {
  icon: LucideIcon;
}

const IconBadge = ({ icon: Icon, variant, size }: IconBadgeProps) => {
  return (
    <div className={cn(backgroundVariants({ variant, size }))}>
      <Icon className={cn(iconVariants({ variant, size }))} />
    </div>
  );
};

IconBadge.displayName = 'IconBadge';

export { IconBadge };
