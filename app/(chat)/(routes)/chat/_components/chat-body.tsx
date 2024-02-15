'use client';

import { ArrowDown } from 'lucide-react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import ScrollToBottom, { useScrollToBottom, useSticky } from 'react-scroll-to-bottom';

import { Button } from '@/components/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { ChatCompletionRole } from '@/constants/open-ai';
import { useChatStore } from '@/hooks/use-chat-store';
import { useCurrentUser } from '@/hooks/use-current-user';

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
  introMessages: string[];
  streamAssistantMessage?: string;
};

export const ChatBody = ({ introMessages, streamAssistantMessage }: ChatBodyProps) => {
  const { user } = useCurrentUser();
  const messages = useChatStore((state) => state.messages);

  const [sticky, setSticky] = useState(false);
  const [scrollToBottom, setScrollToBottom] = useState(false);

  const hasMessages = Boolean(messages.length);

  return (
    <ChatScrollContext.Provider value={{ sticky, scrollToBottom, setSticky, setScrollToBottom }}>
      {!hasMessages && (
        <div className="flex flex-col items-center justify-start gap-y-2 h-full">
          <Avatar>
            <AvatarImage className="bg-white p-1.5 border rounded-full" src="/assets/openai.svg" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <p className="mb-5 text-2xl font-medium">How can I help you today?</p>
        </div>
      )}
      <div className="h-[calc(100%-12rem)] relative">
        {hasMessages ? (
          <ScrollToBottom
            className="flex h-full w-full flex-col"
            followButtonClassName="scroll-to-bottom-button"
          >
            <Content>
              {messages.map((message, index) => {
                const isAssistant = message.role === ChatCompletionRole.ASSISTANT;

                const name = isAssistant ? 'Artificial Intelligence' : user?.name || 'User';
                const picture = isAssistant ? null : user?.image;

                return (
                  <div
                    key={index}
                    className="flex flex-1 text-base md:px-5 lg:px-1 xl:px-5 mx-auto gap-3 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] px-4 first:mt-4 last:mb-6"
                  >
                    <ChatBubble message={message} name={name} picture={picture} />
                  </div>
                );
              })}
              {streamAssistantMessage && (
                <div className="flex flex-1 text-base md:px-5 lg:px-1 xl:px-5 mx-auto gap-3 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] px-4 first:mt-4 last:mb-6">
                  <ChatBubble
                    message={{ role: ChatCompletionRole.ASSISTANT, content: '' }}
                    name={'Artificial Intelligence'}
                    streamMessage={streamAssistantMessage}
                  />
                </div>
              )}
            </Content>
          </ScrollToBottom>
        ) : (
          <ChatIntro introMessages={introMessages} />
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
