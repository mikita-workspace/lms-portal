import { Metadata } from 'next';

import { NavBar } from '@/components/navbar/navbar';
import { SideBar } from '@/components/sidebar/sidebar';

export const metadata: Metadata = {
  title: 'Chat AI',
  description: 'LMS Portal for educational purposes',
};

type DashboardLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const ChatLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 h-full">
        <div className="h-[80px] inset-y-0 w-full z-[50] fixed">
          <NavBar />
        </div>
        <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-[48]">
          <SideBar />
        </div>
        <main className="md:pl-64 pt-[80px] h-full">{children}</main>
      </div>
    </div>
  );
};

export default ChatLayout;
