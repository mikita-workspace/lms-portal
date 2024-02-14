'use client';

import { useEffect, useState } from 'react';

import { ChatBody } from './chat-body';
import { ChatInput } from './chat-input';
import { ChatTopBar } from './chat-top-bar';

export const Chat = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex h-full w-full">
      <div className="flex h-full w-full flex-col overflow-auto bg-background outline-none">
        <div className="flex h-full w-full flex-col justify-between">
          <ChatTopBar />
          <ChatBody />
          <ChatInput />
        </div>
      </div>
    </div>
  );
};
