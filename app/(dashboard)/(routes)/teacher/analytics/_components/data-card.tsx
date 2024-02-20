'use client';

import { User } from '@prisma/client';
import { format } from 'date-fns';
import CountUp from 'react-countup';

import { ScrollArea } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { locales } from '@/constants/locale';
import { getCurrencySymbol } from '@/lib/format';

type DataCardProps = {
  label: string;
  lastPurchases?: { courseTitle: string; timestamp: Date; user?: User }[];
  topSales?: {
    currency: string | null;
    key: string;
    position: (number | null)[];
    sales: number;
    totalPrice: number;
  }[];
  totalRevenue?: Record<string, number>;
  totalSales?: number;
};

export const DataCard = ({
  label,
  lastPurchases,
  topSales,
  totalRevenue,
  totalSales,
}: DataCardProps) => {
  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {lastPurchases && (
            <ScrollArea className="text-xs flex flex-col max-h-[240px]">
              {lastPurchases.map((lp) => (
                <div
                  key={lp.courseTitle}
                  className="flex justify-between border-b last:border-none py-1"
                >
                  <div className="flex flex-col gap-1 truncate">
                    <p className="font-medium">{lp.courseTitle}</p>
                    <p>{lp.user?.email}</p>
                  </div>
                  <span className="text-right">{format(lp.timestamp, 'HH:mm, dd MMM yyyy')}</span>
                </div>
              ))}
            </ScrollArea>
          )}
          {totalRevenue &&
            locales.map((locale) => (
              <CountUp
                key={locale.locale}
                className="text-2xl font-bold"
                decimals={2}
                duration={2.75}
                end={totalRevenue[locale.currency]}
                prefix={`${getCurrencySymbol(locale.locale, locale.currency)} `}
              />
            ))}
          {totalSales && (
            <div className="flex flex-col gap-2">
              <CountUp className="text-2xl font-bold" end={totalSales} duration={2.75} />
              <ScrollArea className="flex flex-col text-sm gap-1 max-h-[200px]">
                <p className="font-medium mb-2">Top Locations</p>
                <ul className="space-y-1">
                  {topSales?.map((sale, index) => {
                    const [country, city] = sale.key.split('-');

                    return (
                      <li key={index}>
                        {country}, {city}
                      </li>
                    );
                  })}
                </ul>
              </ScrollArea>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
