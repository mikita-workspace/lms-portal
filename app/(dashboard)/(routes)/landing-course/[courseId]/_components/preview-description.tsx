'use client';

import { BookOpen } from 'lucide-react';
import { useMemo } from 'react';

import { IconBadge } from '@/components/common/icon-badge';
import { TextBadge } from '@/components/common/text-badge';
import { Skeleton } from '@/components/ui';
import { DEFAULT_CURRENCY_EXCHANGE } from '@/constants/locale';
import { useLocaleStore } from '@/hooks/use-locale-store';
import { formatPrice, getConvertedPrice } from '@/lib/format';
import { hasJsonStructure } from '@/lib/utils';

type PreviewDescriptionProps = {
  categories: string[];
  chaptersLength: number;
  customRates: string | null;
  description: string;
  price: number | null;
  title: string;
};

export const PreviewDescription = ({
  categories,
  chaptersLength,
  customRates,
  description,
  price,
  title,
}: PreviewDescriptionProps) => {
  const localeInfo = useLocaleStore((state) => state.localeInfo);

  const amount = useMemo(() => {
    if (localeInfo?.locale.currency && price) {
      if (hasJsonStructure(customRates ?? '')) {
        return price * JSON.parse(customRates!)[localeInfo.locale.currency];
      }

      return price * localeInfo?.rate ?? DEFAULT_CURRENCY_EXCHANGE;
    }

    return 0;
  }, [customRates, localeInfo?.locale.currency, localeInfo?.rate, price]);

  const formattedPrice = localeInfo?.locale
    ? formatPrice(getConvertedPrice(amount), localeInfo?.locale)
    : null;

  const isLoadingPrice = !Number.isFinite(price) || !formattedPrice;

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
        <p className="text-md md:text-small font-bold text-neutral-700 dark:text-neutral-300">
          {isLoadingPrice && <Skeleton className="h-[20px] w-[100px]" />}
          {!isLoadingPrice && amount > 0 && formattedPrice}
          {!isLoadingPrice && amount === 0 && <TextBadge variant="lime" label="Free" />}
        </p>
      </div>
    </div>
  );
};
