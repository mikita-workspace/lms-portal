'use client';

import { ArrowDown, LoaderPinwheel } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, {
  createContext,
  memo,
  SyntheticEvent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import ScrollToBottom, { useScrollToBottom, useSticky } from 'react-scroll-to-bottom';

import { Button } from '@/components/ui';
import { ChatCompletionRole } from '@/constants/ai';
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
  assistantImage?: string;
  assistantMessage?: string;
  introMessages: string[];
  isShared?: boolean;
  isSubmitting?: boolean;
  onSubmit: (
    event: SyntheticEvent,
    options?: {
      userMessage?: string;
    },
  ) => void;
  sharedName?: string | null;
  sharedPicture?: string | null;
};

const ChatBodyComponent = ({
  assistantImage,
  assistantMessage,
  introMessages,
  isShared,
  isSubmitting,
  onSubmit,
  sharedName,
  sharedPicture,
}: ChatBodyProps) => {
  const t = useTranslations('chat.body');

  const { user } = useCurrentUser();
  const { chatMessages, conversationId, isImageGeneration } = useChatStore((state) => ({
    chatMessages: state.chatMessages,
    conversationId: state.conversationId,
    isImageGeneration: state.isImageGeneration,
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
          <ChatIntro introMessages={introMessages} onSubmit={onSubmit} />
        </div>
      )}
      <div className={cn(isShared ? 'h-[calc(100%-4rem)]' : 'h-[calc(100%-17rem)]', 'relative')}>
        {hasMessages && (
          <ScrollToBottom
            className="flex h-full w-full flex-col"
            followButtonClassName="scroll-to-bottom-button"
          >
            <Content>
              {messages.map((message) => {
                const isAssistant = message.role === ChatCompletionRole.ASSISTANT;

                const [name, picture] = (() => {
                  if (isShared && !isAssistant) {
                    return [sharedName ?? 'Current User', sharedPicture];
                  }

                  if (isAssistant) {
                    return ['Nova Copilot', null];
                  }

                  return [user?.name || 'Current User', user?.image];
                })();

                return (
                  <div
                    key={message.id}
                    className="flex flex-1 text-base md:px-5 lg:px-1 xl:px-5 mx-auto gap-3 md:max-w-3xl lg:max-w-[40rem] xl:max-w-4xl px-4 first:mt-4 last:mb-6"
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

              <div className="flex flex-1 text-base md:px-5 lg:px-1 xl:px-5 mx-auto gap-3 md:max-w-3xl lg:max-w-[40rem] xl:max-w-4xl px-4 first:mt-4 last:mb-6">
                {!assistantMessage && isSubmitting && isImageGeneration && (
                  <div className="flex gap-x-2 items-center justify-center w-full mt-4">
                    <LoaderPinwheel className="h-4 w-4 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{t('image-loading')}</p>
                  </div>
                )}
                {assistantMessage && (
                  <ChatBubble
                    streamImage={assistantImage}
                    isSubmitting={isSubmitting}
                    message={{ role: ChatCompletionRole.ASSISTANT, content: '' }}
                    name="Nova Copilot"
                    streamMessage={assistantMessage}
                  />
                )}
              </div>
            </Content>
          </ScrollToBottom>
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

ChatBodyComponent.displayName = 'ChatBody';

export const ChatBody = memo(ChatBodyComponent);
