import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { UserRole } from '@/constants/auth';

export const metadata: Metadata = {
  title: 'Teacher',
  description: 'Educational portal',
};

type TeacherLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const TeacherLayout = async ({ children }: TeacherLayoutProps) => {
  const user = await getCurrentUser();

  if (![UserRole.ADMIN, UserRole.TEACHER].includes(user?.role as UserRole)) {
    return redirect('/');
  }

  return <>{children}</>;
};

export default TeacherLayout;
