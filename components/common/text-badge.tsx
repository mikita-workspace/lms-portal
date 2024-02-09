import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import { Badge } from '../ui';

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

const textVariants = cva('', {
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
type TextVariantsProps = VariantProps<typeof textVariants>;

interface IconBadgeProps extends BackgroundVariantsProps, TextVariantsProps {
  label: string;
}

const TextBadge = ({ variant, label }: IconBadgeProps) => {
  return (
    <Badge className={cn(backgroundVariants({ variant }))} variant="outline">
      <span className={cn(textVariants({ variant }))}> {label}</span>
    </Badge>
  );
};

TextBadge.displayName = 'TextBadge';

export { TextBadge };
