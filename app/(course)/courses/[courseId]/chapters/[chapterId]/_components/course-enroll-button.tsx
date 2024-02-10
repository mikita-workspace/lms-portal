'use client';

import { Button } from '@/components/ui';
import { Currency, Locale } from '@/constants/locale';
import { formatPrice } from '@/lib/format';

type CourseEnrollButtonProps = { courseId: string; price: number | null };

export const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
  return (
    <Button className="w-full md:w-auto" size="sm">
      Enroll for&nbsp;
      {price ? formatPrice(price, { currency: Currency.USD, locale: Locale.EN_US }) : 'Free'}
    </Button>
  );
};
