import { SquareArrowOutUpRight } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getGlobalProgress } from '@/actions/courses/get-global-progress';
import { getUserNotifications } from '@/actions/users/get-user-notifications';
import { NavBar } from '@/components/navbar/navbar';
import { Button } from '@/components/ui';
import { absoluteUrl, cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Chat AI',
  description: 'Chat AI',
};

type ChatLayoutProps = Readonly<{
  children: React.ReactNode;
  params: { slug: string[] };
}>;

const ChatLayout = async ({ children, params }: ChatLayoutProps) => {
  const user = await getCurrentUser();
  const globalProgress = await getGlobalProgress(user?.userId);
  const { notifications: userNotifications } = await getUserNotifications({
    userId: user?.userId,
    take: 5,
  });

  if (!user?.hasSubscription) {
    return redirect('/');
  }

  const isIframe = params.slug?.includes('iframe');

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 h-full">
        {isIframe && (
          <div className="h-[50px] inset-y-0 w-full z-[50] fixed pt-4 px-4">
            <Link href={absoluteUrl('/chat')} target="_blank">
              <Button className="w-full" variant="outline">
                <SquareArrowOutUpRight className="mr-2 h-4 w-4" />
                Open in New Tab
              </Button>
            </Link>
          </div>
        )}
        {!isIframe && (
          <div className="h-[80px] inset-y-0 w-full z-[50] fixed">
            <NavBar isChat globalProgress={globalProgress} userNotifications={userNotifications} />
          </div>
        )}
        <main className={cn(isIframe ? 'pt-[50px]' : 'pt-[80px]', 'h-full')}>{children}</main>
      </div>
    </div>
  );
};

export default ChatLayout;
