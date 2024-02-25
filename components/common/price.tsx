'use client';

import { useEffect, useMemo, useState } from 'react';

import { DEFAULT_CURRENCY_EXCHANGE } from '@/constants/locale';
import { useLocaleStore } from '@/hooks/use-locale-store';
import { formatPrice, getConvertedPrice } from '@/lib/format';
import { hasJsonStructure } from '@/lib/utils';

import { Skeleton } from '../ui';
import { TextBadge } from './text-badge';

type PriceProps = {
  customRates: string | null;
  price: number | null;
};

export const Price = ({ customRates, price }: PriceProps) => {
  const localeInfo = useLocaleStore((state) => state.localeInfo);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const isLoading = !Number.isFinite(price) || !formattedPrice || !localeInfo;

  if (!isMounted) {
    return <Skeleton className="h-[20px] w-[100px]" />;
  }

  return (
    <p className="text-md md:text-small font-bold text-neutral-700 dark:text-neutral-300">
      {isLoading && <Skeleton className="h-[20px] w-[100px]" />}
      {!isLoading && amount > 0 && formattedPrice}
      {!isLoading && amount === 0 && <TextBadge variant="lime" label="Free" />}
    </p>
  );
};
