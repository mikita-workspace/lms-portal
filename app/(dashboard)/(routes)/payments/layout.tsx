import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { isOwner } from '@/lib/owner';

export const metadata: Metadata = {
  title: 'Payments',
  description: 'LMS Portal for educational purposes',
};

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
