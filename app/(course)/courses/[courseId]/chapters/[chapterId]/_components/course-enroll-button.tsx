'use client';

import axios from 'axios';
import { ShoppingCart } from 'lucide-react';
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

        return null;
      },
      error: () => {
        setIsLoading(false);

        return 'Something went wrong';
      },
    });
  };

  return (
    <Button
      className="w-full md:w-auto focus:outline-none  bg-green-700 hover:bg-green-800 font-medium text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 text-white"
      disabled={isLoading}
      onClick={handleClick}
      size="sm"
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      Enroll for&nbsp;
      {formatPrice(price, { currency: Currency.USD, locale: Locale.EN_US })}
    </Button>
  );
};
