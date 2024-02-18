'use client';

import { Price } from '@prisma/client';
import { ArrowRight, MoreHorizontal, ShoppingCart } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui';
import { useCurrentLocale } from '@/hooks/use-current-locale';
import { fetcher } from '@/lib/fetcher';
import { formatPrice } from '@/lib/format';

type CourseEnrollButtonProps = { courseId: string; prices: Price };

export const CourseEnrollButton = ({ courseId, prices }: CourseEnrollButtonProps) => {
  const { ipInfo, isFetching: isIpFetching, error: ipInfoError } = useCurrentLocale();

  const [isLoading, setIsLoading] = useState(false);

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

  const handleClick = async () => {
    setIsLoading(true);

    await toast.promise(
      fetcher.post(`/api/courses/${courseId}/checkout`, {
        body: { ...ipInfo },
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

  return (
    <Button
      className="w-full md:w-auto"
      disabled={isLoading || isIpFetching || Boolean(ipInfoError)}
      onClick={handleClick}
      size="lg"
      variant="success"
    >
      {isIpFetching ? (
        <MoreHorizontal className="w-6 h-6 animate-pulse" />
      ) : (
        <>
          {Boolean(price) && <ShoppingCart className="w-4 h-4 mr-2" />}
          Enroll for&nbsp;
          {Boolean(price) ? (
            price
          ) : (
            <>
              {ipInfoError ? (
                (ipInfoError as Error).message || 'Price Error'
              ) : (
                <>
                  Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </>
          )}
        </>
      )}
    </Button>
  );
};
