import { getCurrentUser } from '@/actions/auth/get-current-user';
import { DataTable } from '@/components/data-table/data-table';
import { db } from '@/lib/db';

import { columns } from './_components/data-table/columns';

const CoursesPage = async () => {
  const user = await getCurrentUser();

  const courses = await db.course.findMany({
    where: { userId: user!.userId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium mb-12">Courses</h1>
      <DataTable columns={columns} data={courses} isTeacherCoursesPage noLabel="No courses" />
    </div>
  );
};

export default CoursesPage;
