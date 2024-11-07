'use client';

import { Text } from 'lucide-react';
import { useEffect } from 'react';

import { Conversation } from '@/actions/chat/get-chat-conversations';
import { useChatStore } from '@/hooks/use-chat-store';
import { getChatMessages } from '@/lib/chat';
import { cn } from '@/lib/utils';

type ChatSideBarItemsProps = {
  conversations: Conversation[];
};

export const ChatSideBarItems = ({ conversations }: ChatSideBarItemsProps) => {
  const { conversationId, setConversationId, setChatMessages } = useChatStore();

  useEffect(() => {
    const chatMessages = getChatMessages(conversations);

    setConversationId(conversations[0].id);
    setChatMessages(chatMessages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnClick = (id: string) => {
    setConversationId(id);
  };

  return conversations.map(({ id, title }) => {
    const isActive = conversationId === id;

    return (
      <button
        key={id}
        className={cn(
          'flex items-center gap-x-2 text-muted-foreground text-sm font-[500] pl-4 pr-2 transition-all duration-300 hover:bg-muted border-b last:border-none',
          isActive && 'text-primary bg-muted',
        )}
        type="button"
        onClick={() => handleOnClick(id)}
      >
        <div className="flex items-center gap-x-2 py-5">
          <Text
            className={cn('text-muted-foreground', isActive && 'text-primary animate-spin-once')}
            size={22}
          />
          <p className="text-left line-clamp-2">{title}</p>
        </div>
      </button>
    );
  });
};
