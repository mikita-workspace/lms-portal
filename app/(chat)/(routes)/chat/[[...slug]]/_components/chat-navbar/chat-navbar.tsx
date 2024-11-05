import { Notification } from '@prisma/client';

import { getChatConversations } from '@/actions/chat/get-chat-conversations';
import { Logo } from '@/components/common/logo';
import { NavBarRoutes } from '@/components/navbar/navbar-routes';

import { ChatMobileSideBar } from '../chat-sidebar/chat-sidebar-mobile';

type ChatNavBarProps = {
  conversations: Awaited<ReturnType<typeof getChatConversations>>;
  globalProgress?: {
    progressPercentage: number;
    total: number;
    value: number;
  } | null;
  userNotifications?: Omit<Notification, 'userId'>[];
};

export const ChatNavBar = ({
  conversations,
  globalProgress,
  userNotifications,
}: ChatNavBarProps) => {
  return (
    <div className="p-4 gap-x-4 h-full flex items-center justify-between bg-white dark:bg-neutral-800 border-b">
      <ChatMobileSideBar conversations={conversations} />
      <Logo isCopilot />
      <NavBarRoutes globalProgress={globalProgress} userNotifications={userNotifications} />
    </div>
  );
};
