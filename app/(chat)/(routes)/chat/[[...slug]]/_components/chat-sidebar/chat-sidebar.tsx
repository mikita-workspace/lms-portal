import { Conversation } from '@/actions/chat/get-chat-conversations';

import { ChatSideBarBottom } from './chat-sidebar-bottom';
import { ChatSideBarItems } from './chat-sidebar-items';
import { ChatSideBarTop } from './chat-sidebar-top';

type ChatSideBarProps = {
  conversations: Conversation[];
};

export const ChatSideBar = async ({ conversations }: ChatSideBarProps) => {
  return (
    <div className="h-full border-r flex flex-col justify-between shadow-sm bg-white dark:bg-neutral-900 md:pt-[80px]">
      <ChatSideBarTop amountOfConversations={conversations.length} />
      <div className="flex flex-col w-full overflow-y-auto h-full">
        <ChatSideBarItems conversations={conversations} />
      </div>
      <ChatSideBarBottom amountOfConversations={conversations.length} />
    </div>
  );
};
