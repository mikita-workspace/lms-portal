'use client';

import { Price } from '@prisma/client';
import { BookOpen } from 'lucide-react';
import { useMemo } from 'react';

import { IconBadge } from '@/components/common/icon-badge';
import { TextBadge } from '@/components/common/text-badge';
import { Skeleton } from '@/components/ui';
import { useCurrentLocale } from '@/hooks/use-current-locale';
import { formatPrice } from '@/lib/format';

type PreviewDescriptionProps = {
  categories: string[];
  chaptersLength: number;
  description: string;
  prices: Price | null;
  title: string;
};

export const PreviewDescription = ({
  categories,
  chaptersLength,
  description,
  prices,
  title,
}: PreviewDescriptionProps) => {
  const { ipInfo, isFetching: isIpFetching, error: ipInfoError } = useCurrentLocale();

  const price = useMemo(() => {
    if (ipInfo) {
      const currency = ipInfo.currency.toLowerCase() as keyof Price;
      const coursePrice = prices ? (prices[currency] as number) : 0;

      if (!coursePrice) {
        return 0;
      }

      return formatPrice(coursePrice, {
        currency: ipInfo.currency,
        locale: ipInfo.locale,
      });
    }

    return null;
  }, [ipInfo, prices]);

  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-center gap-x-2 mb-1">
        <IconBadge size="sm" icon={BookOpen} />
        <span className="text-xs text-muted-foreground">
          {chaptersLength} {chaptersLength > 1 ? 'Chapters' : 'Chapter'}
        </span>
      </div>
      <h3 className="font-semibold text-lg md:text-2xl mb-2 capitalize">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="flex gap-x-2 items-center">
        {categories.map((category) => (
          <TextBadge key={category} label={category} variant="indigo" />
        ))}
      </div>
      <div className="mt-4">
        {!price && !isIpFetching && !ipInfoError ? (
          <TextBadge variant="lime" label="Free" />
        ) : (
          <p className="text-md md:text-small font-bold text-neutral-700 dark:text-neutral-300">
            {ipInfoError && ((ipInfoError as Error).message || 'Price Error')}
            {!ipInfoError && isIpFetching && <Skeleton className="h-[20px] w-2/6" />}
            {!ipInfoError && !isIpFetching && price}
          </p>
        )}
      </div>
    </div>
  );
};
