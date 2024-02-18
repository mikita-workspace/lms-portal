'use client';

import { Price } from '@prisma/client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { locales } from '@/constants/locale';
import { formatPrice } from '@/lib/format';

type DataRevenueProps = {
  prices: Price[];
};

export const DataRevenueCard = ({ prices }: DataRevenueProps) => {
  const totalPrices = prices.reduce<Record<string, number>>((total, price) => {
    Object.keys(price).forEach((key) => {
      const priceKey = key as keyof Price;

      if (typeof price[priceKey] === 'number') {
        total[key] = (total[key] || 0) + (price[priceKey] as number);
      }
    });

    return total;
  }, {});

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold flex flex-col gap-2">
          {Object.entries(totalPrices).map(([key, value]) => {
            const locale = locales.find((lc) => lc.currency === key.toUpperCase());

            return <p key={key}>{formatPrice(value, locale!)}</p>;
          })}
        </div>
      </CardContent>
    </Card>
  );
};
