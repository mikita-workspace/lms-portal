'use client';

import axios from 'axios';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui';
import { Currency, Locale } from '@/constants/locale';
import { formatPrice } from '@/lib/format';

type CourseEnrollButtonProps = { courseId: string; price: number };

export const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    await toast.promise(axios.post(`/api/courses/${courseId}/checkout`), {
      loading: 'Payment processing...',
      success: (res) => {
        setIsLoading(false);

        window.location.assign(res.data.url);

        return 'Checkout';
      },
      error: () => {
        setIsLoading(false);

        return 'Something went wrong';
      },
    });
  };

  return (
    <Button
      className="w-full md:w-auto"
      disabled={isLoading}
      onClick={handleClick}
      size="lg"
      variant="success"
    >
      {Boolean(price) && <ShoppingCart className="w-4 h-4 mr-2" />}
      Enroll for&nbsp;
      {Boolean(price) ? (
        formatPrice(price, { currency: Currency.USD, locale: Locale.EN_US })
      ) : (
        <>
          Free
          <ArrowRight className="w-4 h-4 ml-2" />
        </>
      )}
    </Button>
  );
};
