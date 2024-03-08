import { cva, type VariantProps } from 'class-variance-authority';
import { AlertTriangle, CheckCircleIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

const bannerVariants = cva('border p-4 text-sm flex items-center w-full', {
  variants: {
    variant: {
      warning: 'bg-yellow-200/80 dark:bg-yellow-700 text-primary border-b',
      success: 'bg-emerald-700 text-secondary border-b',
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
      <div>
        <Icon className="h-4 w-4 mr-2" />
      </div>
      {label}
    </div>
  );
};

Banner.displayName = 'Banner';

export { Banner };
