'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import ScrollToBottom, { useScrollToBottom, useSticky } from 'react-scroll-to-bottom';

import { Textarea } from '@/components/ui';

import { ChatBubble } from './chat-bubble';

export const ChatAi = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex h-full w-full">
      <div className="relative flex h-full w-full flex-col overflow-auto bg-background outline-none">
        <div className="flex h-full w-full flex-col justify-between">
          <ScrollToBottom className="flex h-[calc(100vh-150px)] w-full flex-col">
            {[...Array(45)].map((i, index) => (
              <div key={index}>
                <div className="relative py-4">
                  Message Message Message Message Message Message{' '}
                </div>
              </div>
            ))}
          </ScrollToBottom>
          <div className="mx-auto flex w-full flex-shrink-0 items-end justify-center space-x-4 px-8 py-4">
            <div className="relative flex w-full flex-col">
              <Textarea
                className="max-h-[400px] resize-none overflow-y-hidden pr-20"
                style={{ height: '40px' }}
                placeholder="Enter your message..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
