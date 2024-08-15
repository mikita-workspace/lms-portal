import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getDashboardCourses } from '@/actions/courses/get-dashboard-courses';
import { FilterStatus } from '@/constants/courses';

import { CoursesList } from '../../_components/courses/courses-list';
import { InfoCard } from './_components/info-card';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Educational portal',
};

type DashboardPageProps = {
  searchParams: { filter: string | null };
};

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const user = await getCurrentUser();

  if (!user) {
    return redirect('/');
  }

  const { completedCourses, coursesInProgress, filterCourses } = await getDashboardCourses(
    user.userId,
    searchParams?.filter ?? null,
  );

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard courseStatus={FilterStatus.PROGRESS} numberOfItems={coursesInProgress.length} />
        <InfoCard courseStatus={FilterStatus.COMPLETED} numberOfItems={completedCourses.length} />
      </div>
      <CoursesList items={filterCourses} />
    </div>
  );
};

export default DashboardPage;
