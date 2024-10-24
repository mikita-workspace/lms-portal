'use client';

import { getTime } from 'date-fns';
import { SyntheticEvent, useRef, useState } from 'react';

import { ChatSkeleton } from '@/components/loaders/chat-skeleton';
import { useToast } from '@/components/ui/use-toast';
import { ChatCompletionRole } from '@/constants/open-ai';
import { useChatStore } from '@/hooks/use-chat-store';
import { useHydration } from '@/hooks/use-hydration';
import { fetcher } from '@/lib/fetcher';

import { ChatBody } from './chat-body';
import { ChatInput } from './chat-input';
import { ChatTopBar } from './chat-top-bar';

type ChatProps = {
  initialData: {
    introMessages: string[];
  };
};

export const Chat = ({ initialData }: ChatProps) => {
  const { toast } = useToast();

  const { currentModel, messages, setMessages } = useChatStore();

  const { isMounted } = useHydration();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [assistantMessage, setAssistantMessage] = useState('');

  const abortControllerRef = useRef<AbortController | null>(null);

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
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
      });

      const reader = completionStream.body?.getReader();
      const decoder = new TextDecoder('utf-8');

      let streamAssistMessage = '';

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
        streamAssistMessage += chunk;

        setAssistantMessage((prev) => prev + chunk);
      }
      saveLastMessage(streamAssistMessage);
      streamAssistMessage = '';
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        toast({
          description: String(error?.message),
          isError: true,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegenerate = (event: SyntheticEvent) => {
    deleteLastMessage();
    handleSubmit(event, { userMessage: messages.slice(-1)[0].content, regenerate: true });
  };

  const handleAbortGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();

      if (assistantMessage) {
        saveLastMessage(assistantMessage);
      }
    }
  };

  const saveLastMessage = (message: string) => {
    const chatStorage = JSON.parse(localStorage.getItem('chat-storage') ?? '{}');
    chatStorage?.state?.messages.push({
      content: message,
      role: ChatCompletionRole.ASSISTANT,
      timestamp: getTime(Date.now()),
    });

    localStorage.setItem('chat-storage', JSON.stringify(chatStorage));
  };

  const deleteLastMessage = () => {
    const chatStorage = JSON.parse(localStorage.getItem('chat-storage') ?? '{}');
    chatStorage?.state?.messages?.pop();

    localStorage.setItem('chat-storage', JSON.stringify(chatStorage));
  };

  return (
    <div className="flex h-full w-full">
      <div className="flex h-full w-full flex-col overflow-auto bg-background outline-none">
        <div className="flex h-full w-full flex-col justify-between">
          <ChatTopBar
            isSubmitting={isSubmitting}
            lastAssistantMessage={assistantMessage}
            setAssistantMessage={setAssistantMessage}
          />
          <ChatBody
            assistantMessage={assistantMessage}
            introMessages={initialData.introMessages}
            isSubmitting={isSubmitting}
            onRegenerate={handleRegenerate}
            onSubmit={handleSubmit}
          />
          <ChatInput
            currenMessage={currentMessage}
            isSubmitting={isSubmitting}
            onAbortGenerating={handleAbortGenerating}
            onSubmit={handleSubmit}
            setCurrentMessage={setCurrentMessage}
          />
        </div>
      </div>
    </div>
  );
};
