'use client';

import CountUp from 'react-countup';

import { getAnalytics } from '@/actions/analytics/get-analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from '@/constants/locale';
import { getConvertedPrice, getCurrencySymbol } from '@/lib/format';
import { isNumber } from '@/lib/guard';

type Analytics = Awaited<ReturnType<typeof getAnalytics>>;

type TotalRevenueCardProps = Pick<Analytics, 'totalRevenue'>;

export const TotalRevenueCard = ({ totalRevenue }: TotalRevenueCardProps) => {
  if (!isNumber(totalRevenue)) {
    return null;
  }

  return (
    <Card className="shadow-none h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <CountUp
            className="text-2xl font-bold"
            decimals={2}
            duration={2.75}
            end={getConvertedPrice(totalRevenue)}
            prefix={`${getCurrencySymbol(DEFAULT_LOCALE, DEFAULT_CURRENCY)} `}
          />
        </div>
      </CardContent>
    </Card>
  );
};
