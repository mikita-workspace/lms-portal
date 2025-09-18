import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { isOwner } from '@/lib/owner';
import { PLATFORM_DESCRIPTION } from '@/constants/common';

export const metadata: Metadata = {
  title: 'Owner',
  description: PLATFORM_DESCRIPTION,
};

type OwnerLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const OwnerLayout = async ({ children }: OwnerLayoutProps) => {
  const user = await getCurrentUser();

  if (!isOwner(user?.userId)) {
    return redirect('/');
  }

  return <>{children}</>;
};

export default OwnerLayout;
