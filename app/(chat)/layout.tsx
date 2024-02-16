import { Metadata } from 'next';

import { NavBar } from '@/components/navbar/navbar';

export const metadata: Metadata = {
  title: 'Chat AI',
  description: 'LMS Portal for educational purposes',
};

type ChatLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const ChatLayout = ({ children }: ChatLayoutProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 h-full">
        <div className="h-[80px] inset-y-0 w-full z-[50] fixed">
          <NavBar isChat />
        </div>
        <main className="pt-[80px] h-full">{children}</main>
      </div>
    </div>
  );
};

export default ChatLayout;
