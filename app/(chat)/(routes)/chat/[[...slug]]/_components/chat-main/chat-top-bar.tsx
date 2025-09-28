'use client';

import { memo } from 'react';

import { ChatModelSwitcher } from '@/components/chat/chat-model-switcher';
import { useChatStore } from '@/hooks/store/use-chat-store';
import { cn } from '@/lib/utils';

type ChatTopBarProps = {
  isEmbed?: boolean;
};

const ChatTopBarComponent = ({ isEmbed = false }: ChatTopBarProps) => {
  const { chatMessages, conversationId } = useChatStore((state) => ({
    chatMessages: state.chatMessages,
    conversationId: state.conversationId,
  }));

  const messages = chatMessages[conversationId] ?? [];

  return (
    <div className={cn('w-full h-[75px]', !messages.length && 'h-full')}>
      <div className="flex flex-1 flex-col text-base md:px-5 lg:px-1 xl:px-5 mx-auto gap-3 md:max-w-3xl lg:max-w-[40rem] xl:max-w-4xl pt-4 px-4">
        {!isEmbed && (
          <ChatModelSwitcher className="flex items-center justify-center w-full gap-x-2" />
        )}
      </div>
    </div>
  );
};

ChatTopBarComponent.displayName = 'ChatTopBar';

export const ChatTopBar = memo(ChatTopBarComponent);
