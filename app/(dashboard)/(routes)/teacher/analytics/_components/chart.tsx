'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { Currency, Locale } from '@/constants/locale';
import { getCurrencySymbol } from '@/lib/format';

type ChartProps = {
  data: {
    title: string;
    total: number;
  }[];
};

export const Chart = ({ data }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid stroke="#cccccc" strokeDasharray="3 3" />
        <XAxis dataKey="title" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${getCurrencySymbol(Locale.EN_US, Currency.USD)}${value}`}
        />
        <Bar dataKey="total" fill="#22c55e" radius={[8, 8, 0, 0]} barSize={45} />
      </BarChart>
    </ResponsiveContainer>
  );
};
