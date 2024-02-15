'use client';

import { SyntheticEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { ChatSkeleton } from '@/components/loaders/chat-skeleton';
import { ChatCompletionRole } from '@/constants/open-ai';
import { useChatStore } from '@/hooks/use-chat-store';
import { fetcher } from '@/lib/fetcher';

import { ChatBody } from './chat-body';
import { ChatInput } from './chat-input';
import { ChatTopBar } from './chat-top-bar';

type ChatProps = {
  initialData: {
    introMessages: string[];
    models: { value: string; label: string }[];
  };
};

export const Chat = ({ initialData }: ChatProps) => {
  const messages = useChatStore((state) => state.messages);
  const currentModel = useChatStore((state) => state.currentModel);

  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMessage, setIsCurrentMessage] = useState('');
  const [assistantMessage, setAssistantMessage] = useState('');

  const handleAddMessages = useChatStore((state) => state.addMessages);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <ChatSkeleton />;
  }

  const handleSubmit = async (event: SyntheticEvent) => {
    try {
      event.preventDefault();

      setIsSubmitting(true);

      const currentUserMessage = { role: ChatCompletionRole.USER, content: currentMessage };
      const currentAssistantMessage = {
        role: ChatCompletionRole.ASSISTANT,
        content: assistantMessage,
      };

      handleAddMessages(
        [currentAssistantMessage, currentUserMessage].filter((message) => message.content.length),
      );

      setAssistantMessage('');
      setIsCurrentMessage('');

      const completionStream = await fetcher.post('/api/openai/completions', {
        body: {
          messages: [...messages, currentAssistantMessage, currentUserMessage],
          model: currentModel,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const reader = completionStream.body?.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const rawChunk = await reader?.read();

        if (!rawChunk) {
          throw new Error('Unable to process chunk');
        }

        const { done, value } = rawChunk;

        if (done) {
          break;
        }

        const chunk = decoder.decode(value);

        setAssistantMessage((prev) => prev + chunk);
      }
    } catch (error: any) {
      toast.error(String(error?.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full w-full">
      <div className="flex h-full w-full flex-col overflow-auto bg-background outline-none">
        <div className="flex h-full w-full flex-col justify-between">
          <ChatTopBar models={initialData.models} />
          <ChatBody
            introMessages={initialData.introMessages}
            streamAssistantMessage={assistantMessage}
          />
          <ChatInput
            currenMessage={currentMessage}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            setIsCurrentMessage={setIsCurrentMessage}
          />
        </div>
      </div>
    </div>
  );
};
