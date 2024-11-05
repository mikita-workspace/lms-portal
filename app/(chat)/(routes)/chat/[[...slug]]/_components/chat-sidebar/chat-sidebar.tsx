import { getChatConversations } from '@/actions/chat/get-chat-conversations';

import { ChatSideBarItems } from './chat-sidebar-items';

type ChatSideBarProps = {
  conversations: Awaited<ReturnType<typeof getChatConversations>>;
};

export const ChatSideBar = async ({ conversations }: ChatSideBarProps) => {
  return (
    <div className="h-full border-r flex flex-col shadow-sm bg-white dark:bg-neutral-900 md:pt-[80px]">
      <div className="flex flex-col w-full overflow-y-auto">
        <ChatSideBarItems conversations={conversations} />
      </div>
    </div>
  );
};
