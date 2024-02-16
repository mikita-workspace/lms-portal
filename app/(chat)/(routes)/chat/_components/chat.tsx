'use client';

import { getTime } from 'date-fns';
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
  const { currentModel, messages, removeMessages, setMessages } = useChatStore();

  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [assistantMessage, setAssistantMessage] = useState('');

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setIsMounted(true);

    return () => removeMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isMounted) {
    return <ChatSkeleton />;
  }

  const handleSubmit = async (
    event: SyntheticEvent,
    options?: { userMessage?: string; regenerate?: boolean },
  ) => {
    try {
      event.preventDefault();

      setIsSubmitting(true);

      const currentUserMessage = {
        content: currentMessage || options?.userMessage || '',
        role: ChatCompletionRole.USER,
        timestamp: getTime(Date.now()),
      };

      const currentAssistantMessage = {
        content: options?.userMessage ? '' : assistantMessage,
        role: ChatCompletionRole.ASSISTANT,
        timestamp: getTime(Date.now()),
      };

      const messagesForApi = [currentAssistantMessage, currentUserMessage].filter(
        (message) => message.content.length,
      );

      if (!messagesForApi.length) {
        return;
      }

      if (!options?.regenerate) {
        setMessages([...messages, ...messagesForApi]);
      }

      setAssistantMessage('');
      setCurrentMessage('');

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      const completionStream = await fetcher.post('/api/openai/completions', {
        body: {
          messages: [...messages, ...(options?.regenerate ? [] : messagesForApi)].map(
            ({ content, role }) => ({
              content,
              role,
            }),
          ),
          model: currentModel,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
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
      if (error.name !== 'AbortError') {
        toast.error(String(error?.message));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegenerate = (event: SyntheticEvent) =>
    handleSubmit(event, { userMessage: messages.slice(-1)[0].content, regenerate: true });

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
            onRegenerate={handleRegenerate}
            setAssistantMessage={setAssistantMessage}
          />
          <ChatBody
            introMessages={initialData.introMessages}
            onSubmit={handleSubmit}
            assistantMessage={assistantMessage}
          />
          <ChatInput
            currenMessage={currentMessage}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            setCurrentMessage={setCurrentMessage}
          />
        </div>
      </div>
    </div>
  );
};
