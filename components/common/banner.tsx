import { cva, type VariantProps } from 'class-variance-authority';
import { AlertTriangle, CheckCircleIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

const bannerVariants = cva('border p-4 text-sm flex items-center w-full', {
  variants: {
    variant: {
      warning: 'bg-yellow-200/80 border-x-yellow-30 dark:bg-yellow-700 text-primary',
      success: 'bg-emerald-700 border-emerald-800 dark:bg-emerald-200/80 text-secondary',
    },
  },
  defaultVariants: { variant: 'warning' },
});

type BannerVariantsProps = VariantProps<typeof bannerVariants>;

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
};

interface BannerProps extends BannerVariantsProps {
  label: string;
}

const Banner = ({ label, variant }: BannerProps) => {
  const Icon = iconMap[variant || 'warning'];

  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </div>
  );
};

Banner.displayName = 'Banner';

export { Banner };
