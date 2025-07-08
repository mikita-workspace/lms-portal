'use client';

import CountUp from 'react-countup';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from '@/constants/locale';
import { formatPrice, getConvertedPrice, getCurrencySymbol } from '@/lib/format';

type TotalCardProps = {
  type: 'money' | 'time';
};

export const TotalCard = ({ type }: TotalCardProps) => {
  const defaultLocale = { locale: DEFAULT_LOCALE, currency: DEFAULT_CURRENCY };

  return (
    <Card className="shadow-none h-full p-6">
      <CardTitle className="mb-2">Total time spent</CardTitle>
      <CardDescription className="text-xs mb-4">Your exercise minutes</CardDescription>
      <CardContent className="m-0 p-0">
        <CountUp
          className="font-semibold"
          decimals={2}
          duration={2.75}
          end={getConvertedPrice(100000)}
          prefix={`${getCurrencySymbol(DEFAULT_LOCALE, DEFAULT_CURRENCY)} `}
        />
      </CardContent>
    </Card>
  );
};
