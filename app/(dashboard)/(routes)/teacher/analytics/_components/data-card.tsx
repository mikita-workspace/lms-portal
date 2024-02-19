'use client';

import { User } from '@prisma/client';
import { format } from 'date-fns';
import CountUp from 'react-countup';

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
            <div className="text-xs flex flex-col">
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
            </div>
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
              <div className="flex flex-col text-sm gap-1">
                <p className="font-medium mb-2">Top Locations</p>
                {topSales?.map((sale) => {
                  const [country, city] = sale.key.split('-');

                  return (
                    <span key={sale.key}>
                      {country}, {city}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
