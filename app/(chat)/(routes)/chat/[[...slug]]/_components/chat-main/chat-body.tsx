'use client';

import { ArrowDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, {
  createContext,
  SyntheticEvent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import ScrollToBottom, { useScrollToBottom, useSticky } from 'react-scroll-to-bottom';

import { Avatar, AvatarFallback, AvatarImage, Button } from '@/components/ui';
import { ChatCompletionRole } from '@/constants/open-ai';
import { useChatStore } from '@/hooks/store/use-chat-store';
import { useCurrentUser } from '@/hooks/use-current-user';
import { cn } from '@/lib/utils';

import { ChatBubble } from './chat-bubble';
import { ChatIntro } from './chat-intro';

const ChatScrollContext = createContext({
  sticky: false,
  scrollToBottom: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setSticky: (value: boolean) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setScrollToBottom: (value: boolean) => {},
});

type ContentProps = {
  children: React.ReactNode;
};

const Content = ({ children }: ContentProps) => {
  const { scrollToBottom, setSticky, setScrollToBottom } = useContext(ChatScrollContext);

  const [sticky] = useSticky();
  const handleScrollToBottom = useScrollToBottom();

  useEffect(() => {
    setSticky(sticky);

    if (scrollToBottom) {
      handleScrollToBottom();
      setScrollToBottom(false);
    }
  }, [handleScrollToBottom, scrollToBottom, setScrollToBottom, setSticky, sticky]);

  return <>{children}</>;
};

type ChatBodyProps = {
  assistantMessage?: string;
  introMessages: string[];
  isShared?: boolean;
  isSubmitting?: boolean;
  sharedName?: string | null;
  onSubmit: (
    event: SyntheticEvent,
    options?: {
      userMessage?: string;
    },
  ) => void;
};

export const ChatBody = ({
  assistantMessage,
  introMessages,
  isShared,
  isSubmitting,
  sharedName,
  onSubmit,
}: ChatBodyProps) => {
  const t = useTranslations('chat.body');

  const { user } = useCurrentUser();
  const { chatMessages, conversationId } = useChatStore((state) => ({
    chatMessages: state.chatMessages,
    conversationId: state.conversationId,
  }));

  const [sticky, setSticky] = useState(false);
  const [scrollToBottom, setScrollToBottom] = useState(false);

  const messages = chatMessages[conversationId] ?? [];
  const hasMessages = Boolean(messages.length);

  const value = useMemo(
    () => ({ sticky, scrollToBottom, setSticky, setScrollToBottom }),
    [scrollToBottom, sticky],
  );

  return (
    <ChatScrollContext.Provider value={value}>
      {!hasMessages && !isShared && (
        <div className="flex flex-col items-center justify-start gap-y-2 h-full">
          <Avatar className="border dark:border-muted-foreground">
            <AvatarImage className="bg-white p-2 rounded-full" src="/assets/copilot.svg" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <p className="mb-5 mx-4 text-2xl font-medium text-center">{t('title')}</p>
        </div>
      )}
      <div className={cn(isShared ? 'h-[calc(100%-4rem)]' : 'h-[calc(100%-12rem)]', 'relative')}>
        {hasMessages && (
          <ScrollToBottom
            className="flex h-full w-full flex-col"
            followButtonClassName="scroll-to-bottom-button"
          >
            <Content>
              {messages.map((message) => {
                const isAssistant = message.role === ChatCompletionRole.ASSISTANT;

                const name = (() => {
                  if (isShared && !isAssistant) {
                    return sharedName ?? 'Current User';
                  }

                  return isAssistant ? 'Nova Copilot' : user?.name || 'Current User';
                })();
                const picture = isAssistant ? null : user?.image;

                return (
                  <div
                    key={message.id}
                    className="flex flex-1 text-base md:px-5 lg:px-1 xl:px-5 mx-auto gap-3 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] px-4 first:mt-4 last:mb-6"
                  >
                    <ChatBubble
                      isShared={isShared}
                      message={message}
                      name={name}
                      picture={picture}
                    />
                  </div>
                );
              })}
              {assistantMessage && (
                <div className="flex flex-1 text-base md:px-5 lg:px-1 xl:px-5 mx-auto gap-3 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] px-4 first:mt-4 last:mb-6">
                  <ChatBubble
                    isSubmitting={isSubmitting}
                    message={{ role: ChatCompletionRole.ASSISTANT, content: '' }}
                    name="Nova Copilot"
                    streamMessage={assistantMessage}
                  />
                </div>
              )}
            </Content>
          </ScrollToBottom>
        )}
        {!hasMessages && !isShared && (
          <ChatIntro introMessages={introMessages} onSubmit={onSubmit} />
        )}
        {!sticky && hasMessages && (
          <Button
            className="w-10 h-10 rounded-full p-2 absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            variant="outline"
            onClick={() => setScrollToBottom(true)}
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
        )}
      </div>
    </ChatScrollContext.Provider>
  );
};
