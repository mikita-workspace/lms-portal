import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';

import { columns } from './_components/data-table/columns';
import { DataTable } from './_components/data-table/data-table';

async function getData(): Promise<any[]> {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com',
    },
    // ...
  ];
}

const CoursesPage = async () => {
  const user = await getCurrentUser();

  if (!user?.userId) {
    return redirect('/');
  }

  const courses = await db.course.findMany({
    where: { userId: user.userId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
