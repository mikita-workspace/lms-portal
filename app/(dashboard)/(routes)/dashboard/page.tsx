import { CheckCircle, Clock } from 'lucide-react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getDashboardCourses } from '@/actions/courses/get-dashboard-courses';

import { CoursesList } from '../../_components/courses/courses-list';
import { InfoCard } from './_components/info-card';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'LMS Portal for educational purposes',
};

const DashboardPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return redirect('/');
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(user.userId);

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard icon={Clock} label="In Progress" numberOfItems={coursesInProgress.length} />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
};

export default DashboardPage;
