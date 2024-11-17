import { Notification } from '@prisma/client';

import { Conversation } from '@/actions/chat/get-chat-conversations';
import { Logo } from '@/components/common/logo';
import { NavBarRoutes } from '@/components/navbar/navbar-routes';

import { ChatMobileSideBar } from '../chat-sidebar/chat-sidebar-mobile';

type ChatNavBarProps = {
  conversations: Conversation[];
  globalProgress?: {
    progressPercentage: number;
    total: number;
    value: number;
  } | null;
  isShared?: boolean;
  userNotifications?: Omit<Notification, 'userId'>[];
};

export const ChatNavBar = ({
  conversations,
  globalProgress,
  isShared,
  userNotifications,
}: ChatNavBarProps) => {
  return (
    <div className="p-4 gap-x-4 h-full flex items-center justify-between bg-white dark:bg-neutral-800 border-b">
      {!isShared && <ChatMobileSideBar conversations={conversations} />}
      <Logo isCopilot />
      <NavBarRoutes globalProgress={globalProgress} userNotifications={userNotifications} />
    </div>
  );
};
