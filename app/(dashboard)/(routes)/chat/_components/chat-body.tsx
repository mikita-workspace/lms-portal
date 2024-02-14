'use client';

import { ArrowDown } from 'lucide-react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import ScrollToBottom, { useScrollToBottom, useSticky } from 'react-scroll-to-bottom';

import { Button } from '@/components/ui';

import { ChatBubble } from './chat-bubble';

const ChatBodyContext = createContext({
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
  const { scrollToBottom, setSticky, setScrollToBottom } = useContext(ChatBodyContext);

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

export const ChatBody = () => {
  const [sticky, setSticky] = useState(false);
  const [scrollToBottom, setScrollToBottom] = useState(false);

  return (
    <ChatBodyContext.Provider value={{ sticky, scrollToBottom, setSticky, setScrollToBottom }}>
      <div className="h-[calc(100%-12rem)] relative">
        <ScrollToBottom
          className="flex h-full w-full flex-col"
          followButtonClassName="scroll-to-bottom-button"
        >
          <Content>
            {[...Array(45)].map((i, index) => (
              <div
                key={index}
                className="flex flex-1 text-base md:px-5 lg:px-1 xl:px-5 mx-auto gap-3 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] first:pt-4 last:pb-6 px-4"
              >
                <ChatBubble
                  message={
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure ipsa, sed voluptatem laborum, eum deserunt error in quis enim debitis obcaecati iste. Eligendi tenetur blanditiis saepe ad est dicta deleniti.'
                  }
                  name={'John Doe'}
                />
              </div>
            ))}
          </Content>
        </ScrollToBottom>
        {!sticky && (
          <Button
            className="w-10 h-10 rounded-full p-2 absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            variant="outline"
            onClick={() => setScrollToBottom(true)}
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
        )}
      </div>
    </ChatBodyContext.Provider>
  );
};
