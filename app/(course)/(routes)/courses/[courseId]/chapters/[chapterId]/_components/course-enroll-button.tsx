'use client';

import { ArrowRight, MoreHorizontal, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui';
import { useLocaleAmount } from '@/hooks/use-locale-amount';
import { fetcher } from '@/lib/fetcher';

type CourseEnrollButtonProps = {
  courseId: string;
  customRates: string | null;
  price: number | null;
};

export const CourseEnrollButton = ({ courseId, customRates, price }: CourseEnrollButtonProps) => {
  const { amount, formattedPrice, isLoading } = useLocaleAmount(price, customRates);

  const [isFetching, setIsFetching] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = async () => {
    setIsFetching(true);

    await toast.promise(
      fetcher.post(`/api/courses/${courseId}/checkout`, {
        body: {},
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
      <Button className="w-full md:w-auto" size="lg" variant="success" disabled>
        <MoreHorizontal className="w-6 h-6 animate-pulse" />
      </Button>
    );
  }

  return (
    <Button
      className="w-full md:w-auto"
      disabled={isFetching || isLoading}
      onClick={handleClick}
      size="lg"
      variant="success"
    >
      {isLoading && <MoreHorizontal className="w-6 h-6 animate-pulse" />}
      {!isLoading && amount > 0 && <ShoppingCart className="w-4 h-4 mr-2" />}
      Enroll for&nbsp;
      {!isLoading && amount > 0 && formattedPrice}
      {!isLoading && amount === 0 && (
        <>
          Free
          <ArrowRight className="w-4 h-4 ml-2" />
        </>
      )}
    </Button>
  );
};
