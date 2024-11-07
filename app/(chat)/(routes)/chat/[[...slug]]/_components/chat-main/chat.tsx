'use client';

import { SyntheticEvent, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Conversation } from '@/actions/chat/get-chat-conversations';
import { getChatInitial } from '@/actions/chat/get-chat-initial';
import { ChatSkeleton } from '@/components/loaders/chat-skeleton';
import { useToast } from '@/components/ui/use-toast';
import { ChatCompletionRole } from '@/constants/open-ai';
import { useChatStore } from '@/hooks/use-chat-store';
import { useHydration } from '@/hooks/use-hydration';
import { fetcher } from '@/lib/fetcher';

import { ChatBody } from './chat-body';
import { ChatInput } from './chat-input';
import { ChatTopBar } from './chat-top-bar';

type Message = Conversation['messages'][0];

type ChatProps = {
  initialData: Awaited<ReturnType<typeof getChatInitial>>;
};

export const Chat = ({ initialData }: ChatProps) => {
  const { toast } = useToast();

  const { conversationId, currentModel, chatMessages, setChatMessages } = useChatStore();

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

      const messages = chatMessages[conversationId];

      const currentUserMessage = {
        content: currentMessage || options?.userMessage || '',
        id: uuidv4(),
        role: ChatCompletionRole.USER,
      } as Message;

      const currentAssistantMessage = {
        content: options?.userMessage ? '' : assistantMessage,
        id: uuidv4(),
        role: ChatCompletionRole.ASSISTANT,
      } as Message;

      const messagesForApi = [currentAssistantMessage, currentUserMessage].filter(
        (message) => message.content.length,
      );

      if (!messagesForApi.length) {
        return;
      }

      if (!options?.regenerate) {
        const updatedChatMessages = {
          ...chatMessages,
          [conversationId]: [...messages, ...messagesForApi],
        };

        setChatMessages(updatedChatMessages);
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

      saveLastMessage(currentUserMessage, {
        content: streamAssistMessage,
        id: uuidv4(),
        role: ChatCompletionRole.ASSISTANT,
      } as Message);

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
    // handleSubmit(event, { userMessage: messages.slice(-1)[0].content, regenerate: true });
  };

  const handleAbortGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();

      // if (assistantMessage) {
      //   saveLastMessage('', assistantMessage);
      // }
    }
  };

  const saveLastMessage = async (userMessage: Message, assistMessage: Message) => {
    const response = await fetcher.post('/api/chat', {
      body: {
        conversationId,
        messages: [
          { content: userMessage.content, role: ChatCompletionRole.USER },
          { content: assistMessage.content, role: ChatCompletionRole.ASSISTANT },
        ],
        model: currentModel,
      },
      responseType: 'json',
    });

    if (response?.messages) {
      setAssistantMessage('');

      const updatedChatMessages = {
        ...chatMessages,
        [conversationId]: [
          ...chatMessages[conversationId].filter(
            (msg) => ![userMessage.id, assistMessage.id].includes(msg.id),
          ),
          ...response.messages,
        ],
      };

      setChatMessages(updatedChatMessages);
    }
  };

  const deleteLastMessage = async () => {
    const chatStorage = JSON.parse(localStorage.getItem('chat-storage') ?? '{}');
    chatStorage?.state?.messages?.pop();

    localStorage.setItem('chat-storage', JSON.stringify(chatStorage));
  };

  return (
    <div className="flex h-full w-full">
      <div className="flex h-full w-full flex-col overflow-hidden bg-background outline-none">
        <div className="flex h-full w-full flex-col justify-between">
          <ChatTopBar isSubmitting={isSubmitting} setAssistantMessage={setAssistantMessage} />
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
