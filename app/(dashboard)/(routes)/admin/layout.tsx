import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { UserRole } from '@/constants/auth';
import { isOwner } from '@/lib/owner';

type AdminLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  const user = await getCurrentUser();

  if (user?.role !== UserRole.ADMIN && !isOwner(user?.userId)) {
    return redirect('/');
  }

  return <>{children}</>;
};

export default AdminLayout;
