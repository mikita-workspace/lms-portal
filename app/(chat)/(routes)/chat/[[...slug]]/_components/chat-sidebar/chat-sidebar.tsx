import { Conversation } from '@/actions/chat/get-chat-conversations';

import { ChatSideBarBottom } from './chat-sidebar-bottom';
import { ChatSideBarItems } from './chat-sidebar-items';
import { ChatSideBarTop } from './chat-sidebat-top';

type ChatSideBarProps = {
  conversations: Conversation[];
};

export const ChatSideBar = async ({ conversations }: ChatSideBarProps) => {
  return (
    <div className="h-full border-r flex flex-col justify-between shadow-sm bg-white dark:bg-neutral-900 md:pt-[80px]">
      <div className="flex flex-col">
        <ChatSideBarTop />
        <div className="flex flex-col w-full overflow-y-auto">
          <ChatSideBarItems conversations={conversations} />
        </div>
      </div>
      <ChatSideBarBottom />
    </div>
  );
};