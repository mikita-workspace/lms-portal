import { getCurrentUser } from '@/actions/auth/get-current-user';
import { db } from '@/lib/db';

import { columns } from './_components/data-table/columns';
import { DataTable } from './_components/data-table/data-table';

const CoursesPage = async () => {
  const user = await getCurrentUser();

  const courses = await db.course.findMany({
    where: { userId: user!.userId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
