'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type DataCardProps = {
  sales: number;
};

export const DataSalesCard = ({ sales }: DataCardProps) => {
  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{sales}</div>
      </CardContent>
    </Card>
  );
};
