import { Menu } from 'lucide-react';

import { getChatConversations } from '@/actions/chat/get-chat-conversations';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { ChatSideBar } from './chat-sidebar';

type ChatMobileSideBarProps = {
  conversations: Awaited<ReturnType<typeof getChatConversations>>;
};

export const ChatMobileSideBar = ({ conversations }: ChatMobileSideBarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition duration-300">
        <Menu />
      </SheetTrigger>
      <SheetContent className="p-0 bg-white w-72" side="left">
        <ChatSideBar conversations={conversations} />
      </SheetContent>
    </Sheet>
  );
};
