'use client';

import { ArrowRight, MoreHorizontal, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button, ButtonProps } from '@/components/ui';
import { useLocaleAmount } from '@/hooks/use-locale-amount';
import { useLocaleStore } from '@/hooks/use-locale-store';
import { fetcher } from '@/lib/fetcher';

type CourseEnrollButtonProps = {
  courseId: string;
  customRates: string | null;
  price: number | null;
  variant?: ButtonProps['variant'];
};

export const CourseEnrollButton = ({
  courseId,
  customRates,
  price,
  variant = 'success',
}: CourseEnrollButtonProps) => {
  const localeInfo = useLocaleStore((state) => state.localeInfo);
  const { amount, formattedPrice, isLoading } = useLocaleAmount({ price, customRates });

  const [isFetching, setIsFetching] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = async () => {
    setIsFetching(true);

    await toast.promise(
      fetcher.post(`/api/courses/${courseId}/checkout`, {
        body: {
          locale: localeInfo?.locale,
          details: localeInfo?.details,
          rate: localeInfo?.rate,
        },
        responseType: 'json',
      }),
      {
        loading: 'Payment processing...',
        success: (data) => {
          setIsFetching(false);

          window.location.assign(data.url);

          return 'Checkout';
        },
        error: () => {
          setIsFetching(false);

          return 'Something went wrong';
        },
      },
    );
  };

  if (!isMounted) {
    return (
      <Button className="w-full" size="lg" variant={variant} disabled>
        <MoreHorizontal className="w-6 h-6 animate-pulse" />
      </Button>
    );
  }

  return (
    <Button
      className="w-full"
      disabled={isFetching || isLoading}
      onClick={handleClick}
      size="lg"
      variant={variant}
    >
      {isLoading && <MoreHorizontal className="w-6 h-6 animate-pulse" />}
      {!isLoading && (amount ?? 0) > 0 && <ShoppingCart className="w-4 h-4 mr-2" />}
      {!isLoading && <span>Enroll for&nbsp;</span>}
      {!isLoading && (amount ?? 0) > 0 && formattedPrice}
      {!isLoading && amount === 0 && (
        <>
          Free
          <ArrowRight className="w-4 h-4 ml-2" />
        </>
      )}
    </Button>
  );
};
