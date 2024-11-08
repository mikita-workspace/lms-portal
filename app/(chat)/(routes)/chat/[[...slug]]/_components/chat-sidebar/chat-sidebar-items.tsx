'use client';

import { GlobeLock, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Conversation } from '@/actions/chat/get-chat-conversations';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
} from '@/components/ui';
import { useChatStore } from '@/hooks/use-chat-store';
import { getChatMessages } from '@/lib/chat';
import { cn } from '@/lib/utils';

type ChatSideBarItemsProps = {
  conversations: Conversation[];
};

export const ChatSideBarItems = ({ conversations }: ChatSideBarItemsProps) => {
  const t = useTranslations('chat.conversation');

  const { conversationId, setConversationId, setChatMessages } = useChatStore();

  const [editTitleId, setEditTitleId] = useState('');

  useEffect(() => {
    const chatMessages = getChatMessages(conversations);

    setConversationId(conversationId || conversations[0].id);
    setChatMessages(chatMessages);
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-4 w-8 p-0 outline-none" variant="ghost">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="hover:cursor-pointer" onClick={() => setEditTitleId(id)}>
              <Pencil className="h-4 w-4  mr-2" />
              {t('edit')}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer text-red-500"
              disabled={id === conversationId}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t('remove')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </button>
    );
  });
};
