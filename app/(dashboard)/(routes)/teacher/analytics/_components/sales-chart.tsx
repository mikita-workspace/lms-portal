'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

type ChartProps = {
  data: Record<string, number | string>[];
};

export const SalesChart = ({ data }: ChartProps) => {
  return (
    <div className="flex flex-col gap-4 mt-8">
      <p className="font-medium text-xl">Sales chart</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis axisLine={false} dataKey="title" fontSize={10} tickLine={false} />
          <YAxis axisLine={false} fontSize={12} tickLine={false} />
          <Bar dataKey="qty" barSize={36} fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
