import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { isOwner } from '@/lib/owner';

type PaymentsLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const PaymentsLayout = async ({ children }: PaymentsLayoutProps) => {
  const user = await getCurrentUser();

  if (!isOwner(user?.userId)) {
    return redirect('/');
  }

  return <>{children}</>;
};

export default PaymentsLayout;
