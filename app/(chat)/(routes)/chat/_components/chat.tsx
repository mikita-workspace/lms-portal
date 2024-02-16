'use client';

import { SyntheticEvent, useEffect, useRef, useState } from 'react';
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
  const handleRemoveMessages = useChatStore((state) => state.removeMessages);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setIsMounted(true);

    return () => handleRemoveMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isMounted) {
    return <ChatSkeleton />;
  }

  const handleSubmit = async (event: SyntheticEvent, introMessage?: string) => {
    try {
      event.preventDefault();

      setIsSubmitting(true);

      const currentUserMessage = {
        role: ChatCompletionRole.USER,
        content: currentMessage || introMessage || '',
      };
      const currentAssistantMessage = {
        role: ChatCompletionRole.ASSISTANT,
        content: assistantMessage,
      };

      const messagesToApi = [currentAssistantMessage, currentUserMessage].filter(
        (message) => message.content.length,
      );

      if (!messagesToApi.length) {
        return;
      }

      handleAddMessages(messagesToApi);

      setAssistantMessage('');
      setIsCurrentMessage('');

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      const completionStream = await fetcher.post('/api/openai/completions', {
        body: {
          messages: [...messages, currentAssistantMessage, currentUserMessage],
          model: currentModel,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
      });

      const reader = completionStream.body?.getReader();
      const decoder = new TextDecoder();

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
      if (error.name !== 'AbortError') {
        toast.error(String(error?.message));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAbortGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div className="flex h-full w-full">
      <div className="flex h-full w-full flex-col overflow-auto bg-background outline-none">
        <div className="flex h-full w-full flex-col justify-between">
          <ChatTopBar
            isSubmitting={isSubmitting}
            lastAssistantMessage={assistantMessage}
            models={initialData.models}
            onAbortGenerating={handleAbortGenerating}
            setAssistantMessage={setAssistantMessage}
          />
          <ChatBody
            introMessages={initialData.introMessages}
            onSubmit={handleSubmit}
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
