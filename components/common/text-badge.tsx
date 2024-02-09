import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

import { Badge } from '../ui';

const backgroundVariants = cva('rounded-full flex items-center justify-center', {
  variants: {
    variant: {
      default: 'bg-neutral-100 dark:bg-neutral-700 border-none',
      lime: 'bg-lime-400/20 dark:bg-lime-400/10 border-none',
      yellow: 'bg-yellow-100 dark:bg-yellow-700 border-none',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const textVariants = cva('', {
  variants: {
    variant: {
      default: 'text-neutral-800 dark:text-neutral-300',
      lime: 'text-lime-700 dark:text-lime-300',
      yellow: 'text-yellow-800 dark:text-yellow-300',
    },
  },
  defaultVariants: {
    variant: 'default',
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
