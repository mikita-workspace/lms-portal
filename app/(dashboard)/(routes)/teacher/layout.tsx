import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { UserRole } from '@/constants/auth';

type TeacherLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const TeacherLayout = async ({ children }: TeacherLayoutProps) => {
  const user = await getCurrentUser();

  if (!user?.userId || ![UserRole.ADMIN, UserRole.TEACHER].includes(user?.role as UserRole)) {
    return redirect('/');
  }

  return <>{children}</>;
};

export default TeacherLayout;