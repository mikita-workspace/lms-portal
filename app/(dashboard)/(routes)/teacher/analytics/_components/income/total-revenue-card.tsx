'use client';

import CountUp from 'react-countup';
import { Line, LineChart } from 'recharts';

import { getAnalytics } from '@/actions/analytics/get-analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from '@/constants/locale';
import { getConvertedPrice, getCurrencySymbol } from '@/lib/format';
import { isNumber } from '@/lib/guard';
import { cn } from '@/lib/utils';

type Analytics = Awaited<ReturnType<typeof getAnalytics>>;

type TotalRevenueCardProps = Pick<Analytics, 'totalRevenue' | 'totalRevenueData'>;

export const TotalRevenueCard = ({ totalRevenue, totalRevenueData }: TotalRevenueCardProps) => {
  if (!isNumber(totalRevenue)) {
    return null;
  }

  const chartConfig = {
    revenue: {
      label: 'Rev',
      color: 'hsl(var(--primary))',
    },
    average: {
      label: 'Avg',
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig;

  const diff = totalRevenueData[totalRevenueData.length - 1]?.diff ?? 0;

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
        {isNumber(diff) && (
          <p className="text-xs">
            <span className={cn('font-bold', diff >= 0 ? 'text-green-500' : 'text-red-500')}>
              {diff >= 0 ? '+' : '-'}
              {diff}
              {'% '}
            </span>
            <span>compared to previous month</span>
          </p>
        )}
        <ChartContainer config={chartConfig} className="h-[80px] w-full pt-4">
          <LineChart
            data={totalRevenueData}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <Line
              type="monotone"
              dataKey="revenue"
              strokeWidth={2}
              stroke="var(--color-revenue)"
              activeDot={{
                r: 8,
                style: { fill: 'var(--color-revenue)' },
              }}
            />
            <Line
              type="monotone"
              strokeWidth={2}
              dataKey="average"
              stroke="var(--color-average)"
              strokeOpacity={0.5}
              activeDot={{
                r: 6,
                fill: 'var(--color-average)',
              }}
            />
            <ChartTooltip content={<ChartTooltipContent hideIndicator isPriceFormat hideLabel />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
