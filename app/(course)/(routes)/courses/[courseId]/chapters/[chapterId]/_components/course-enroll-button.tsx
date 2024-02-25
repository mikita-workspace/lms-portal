'use client';

import { ArrowRight, MoreHorizontal, ShoppingCart } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui';
import { DEFAULT_CURRENCY_EXCHANGE } from '@/constants/locale';
import { useLocaleStore } from '@/hooks/use-locale-store';
import { fetcher } from '@/lib/fetcher';
import { formatPrice, getConvertedPrice } from '@/lib/format';
import { hasJsonStructure } from '@/lib/utils';

type CourseEnrollButtonProps = {
  courseId: string;
  customRates: string | null;
  price: number | null;
};

export const CourseEnrollButton = ({ courseId, customRates, price }: CourseEnrollButtonProps) => {
  const localeInfo = useLocaleStore((state) => state.localeInfo);

  const [isLoading, setIsLoading] = useState(false);
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

  const isLoadingPrice = !Number.isFinite(price) || !formattedPrice;

  const handleClick = async () => {
    setIsLoading(true);

    await toast.promise(
      fetcher.post(`/api/courses/${courseId}/checkout`, {
        body: {},
        responseType: 'json',
      }),
      {
        loading: 'Payment processing...',
        success: (data) => {
          setIsLoading(false);

          window.location.assign(data.url);

          return 'Checkout';
        },
        error: () => {
          setIsLoading(false);

          return 'Something went wrong';
        },
      },
    );
  };

  if (!isMounted) {
    return (
      <Button className="w-full md:w-auto" size="lg" variant="success" disabled>
        <MoreHorizontal className="w-6 h-6 animate-pulse" />
      </Button>
    );
  }

  return (
    <Button
      className="w-full md:w-auto"
      disabled={isLoading || isLoadingPrice}
      onClick={handleClick}
      size="lg"
      variant="success"
    >
      {isLoadingPrice && <MoreHorizontal className="w-6 h-6 animate-pulse" />}
      {!isLoadingPrice && amount > 0 && <ShoppingCart className="w-4 h-4 mr-2" />}
      Enroll for&nbsp;
      {!isLoadingPrice && amount > 0 && formattedPrice}
      {!isLoadingPrice && amount === 0 && (
        <>
          Free
          <ArrowRight className="w-4 h-4 ml-2" />
        </>
      )}
    </Button>
  );
};
