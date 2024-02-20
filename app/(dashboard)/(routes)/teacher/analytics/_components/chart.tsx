'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type ChartProps = {
  data: Record<string, number | string>[];
};

export const Chart = ({ data }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        width={250}
        height={150}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="BYN" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="EUR" stroke="#82ca9d" />
        <Line type="monotone" dataKey="USD" stroke="#ffc658" />
      </LineChart>
    </ResponsiveContainer>
  );
};
