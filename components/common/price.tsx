'use client';

import { useEffect, useState } from 'react';

import { useLocaleAmount } from '@/hooks/use-locale-amount';

import { Skeleton } from '../ui';
import { TextBadge } from './text-badge';

type PriceProps = {
  customRates: string | null;
  price: number | null;
};

export const Price = ({ customRates, price }: PriceProps) => {
  const { amount, formattedPrice, isLoading } = useLocaleAmount(price, customRates);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
