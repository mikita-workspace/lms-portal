import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getGlobalProgress } from '@/actions/courses/get-global-progress';
import { NavBar } from '@/components/navbar/navbar';
import { UserRole } from '@/constants/auth';

export const metadata: Metadata = {
  title: 'Chat AI',
  description: 'LMS Portal for educational purposes',
};

type ChatLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const ChatLayout = async ({ children }: ChatLayoutProps) => {
  const user = await getCurrentUser();
  const globalProgress = await getGlobalProgress(user?.userId);

  if (!user?.userId || ![UserRole.ADMIN, UserRole.TEACHER].includes(user?.role as UserRole)) {
    return redirect('/');
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 h-full">
        <div className="h-[80px] inset-y-0 w-full z-[50] fixed">
          <NavBar isChat globalProgress={globalProgress} />
        </div>
        <main className="pt-[80px] h-full">{children}</main>
      </div>
    </div>
  );
};

export default ChatLayout;
