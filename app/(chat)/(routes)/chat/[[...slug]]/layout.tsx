import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getChatConversations } from '@/actions/chat/get-chat-conversations';
import { getGlobalProgress } from '@/actions/courses/get-global-progress';
import { getUserNotifications } from '@/actions/users/get-user-notifications';
import { cn } from '@/lib/utils';

import { ChatNavBar } from './_components/chat-navbar/chat-navbar';
import { ChatSideBar } from './_components/chat-sidebar/chat-sidebar';

export const metadata: Metadata = {
  title: 'Nova Copilot',
  description: 'Nova Copilot',
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
  const conversations = await getChatConversations();

  if (!user?.hasSubscription) {
    return redirect('/');
  }

  const isEmbed = params.slug?.includes('embed');

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 h-full">
        {!isEmbed && (
          <>
            <div className="h-[80px] inset-y-0 w-full z-[50] fixed">
              <ChatNavBar
                conversations={conversations}
                globalProgress={globalProgress}
                userNotifications={userNotifications}
              />
            </div>
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-48">
              <ChatSideBar conversations={conversations} />
            </div>
          </>
        )}
        <main className={cn(isEmbed ? 'pt-[50px]' : 'md:pl-80 pt-[80px]', 'h-full')}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default ChatLayout;
