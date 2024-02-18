'use client';

import { Course, Purchase, User } from '@prisma/client';
import { format } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type LastPurchaseCardProps = {
  purchases: (Purchase & { user?: User; course: Course })[];
};

export const LastPurchaseCard = ({ purchases }: LastPurchaseCardProps) => {
  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Last Purchases</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs flex flex-col">
          {purchases.map((ps) => {
            const datetime = format(ps.updatedAt, 'HH:mm, dd MMM yyyy');

            return (
              <div key={ps.id} className="flex justify-between border-b last:border-none py-1">
                <div className="flex flex-col gap-1 truncate">
                  <p className="font-medium">{ps.course.title}</p>
                  <p>{ps.user?.email}</p>
                </div>
                <span className="text-right">{datetime}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
