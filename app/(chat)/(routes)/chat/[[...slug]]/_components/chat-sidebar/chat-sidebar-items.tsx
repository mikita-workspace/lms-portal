'use client';

import { GlobeLock } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Conversation } from '@/actions/chat/get-chat-conversations';
import {} from '@/components/ui';
import { useChatStore } from '@/hooks/use-chat-store';
import { getChatMessages } from '@/lib/chat';
import { cn } from '@/lib/utils';

import { ConversationActions } from './conversation-actions';

type ChatSideBarItemsProps = {
  conversations: Conversation[];
};

//FIXME: Add Edit and remove functionality
export const ChatSideBarItems = ({ conversations }: ChatSideBarItemsProps) => {
  const { conversationId, setConversationId, chatMessages, setChatMessages } = useChatStore();

  const [editTitleId, setEditTitleId] = useState('');

  useEffect(() => {
    if (Object.keys(chatMessages).length !== conversations.length) {
      setConversationId(conversationId || conversations[0].id);
      setChatMessages(getChatMessages(conversations));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations.length]);

  const handleOnClick = (id: string) => {
    setConversationId(id);

    if (editTitleId.length && id !== editTitleId) {
      setEditTitleId('');
    }
  };

  return conversations.map(({ id, title }) => {
    const isActive = conversationId === id;

    return (
      <button
        key={id}
        className={cn(
          'flex justify-between items-center gap-x-2 text-muted-foreground text-sm font-[500] pl-4 pr-2 transition-all duration-300 hover:bg-muted border-b last:border-none',
          isActive && 'text-primary bg-muted',
        )}
        type="button"
        onClick={() => handleOnClick(id)}
      >
        <div className="flex items-center gap-x-2 py-5">
          <GlobeLock
            className={cn('text-muted-foreground', isActive && 'text-primary animate-spin-once')}
            size={22}
          />
          <p className="text-left line-clamp-2">
            {editTitleId === id && <Input value={title} />}
            {editTitleId !== id && title}
          </p>
        </div>
        {conversationId && <ConversationActions id={id} setEditTitleId={setEditTitleId} />}
      </button>
    );
  });
};
