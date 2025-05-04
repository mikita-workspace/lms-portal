'use client';

import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Conversation } from '@/actions/chat/get-chat-conversations';
import { getChatInitial } from '@/actions/chat/get-chat-initial';
import { ChatSkeleton } from '@/components/loaders/chat-skeleton';
import { useToast } from '@/components/ui/use-toast';
import { ChatCompletionRole } from '@/constants/ai';
import { useAppConfigStore } from '@/hooks/store/use-app-config-store';
import { useChatStore } from '@/hooks/store/use-chat-store';
import { useHydration } from '@/hooks/use-hydration';
import { getChatMessages } from '@/lib/chat';
import { fetcher } from '@/lib/fetcher';

import { ChatBody } from './chat-body';
import { ChatInput } from './chat-input';
import { ChatSharedTopBar } from './chat-shared-top-bar';
import { ChatTopBar } from './chat-top-bar';

type Message = Conversation['messages'][0];

type ChatProps = {
  conversations?: Conversation[];
  initialData: Awaited<ReturnType<typeof getChatInitial>>;
  isEmbed?: boolean;
  isShared?: boolean;
};

export const Chat = ({ conversations = [], initialData, isEmbed, isShared }: ChatProps) => {
  const { toast } = useToast();

  const {
    chatMessages,
    conversationId,
    currentModel,
    currentModelLabel,
    isImageGeneration,
    setChatMessages,
    setConversationId,
    setCurrentModel,
    setCurrentModelLabel,
    setIsFetching,
  } = useChatStore();
  const { config: appConfig } = useAppConfigStore((state) => ({
    config: state.config,
  }));

  const { isMounted } = useHydration();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [assistantMessage, setAssistantMessage] = useState('');
  const [assistantImage, setAssistantImage] = useState('');

  const abortControllerRef = useRef<AbortController | null>(null);

  const IMAGE_MODELS = appConfig?.ai?.['image-models'] ?? [];
  const TEXT_MODELS = appConfig?.ai?.['text-models'] ?? [];

  useEffect(() => {
    if (conversations.length) {
      const chatMessages = getChatMessages(conversations);

      setConversationId(conversations[0].id);
      setCurrentModel(currentModel || TEXT_MODELS?.[0]?.value || '');
      setCurrentModelLabel(currentModelLabel || TEXT_MODELS?.[0]?.label || '');
      setChatMessages(chatMessages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isMounted) {
    return <ChatSkeleton />;
  }

  const handleSubmit = async (
    event: SyntheticEvent,
    options?: { userMessage?: string; regenerate?: boolean },
  ) => {
    event.preventDefault();

    setIsSubmitting(true);
    setIsFetching(true);

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

    let streamAssistMessage = '';
    let streamAssistImage = '';

    try {
      if (isImageGeneration) {
        const imageGeneration = await fetcher.post('api/ai/image', {
          responseType: 'json',
          body: {
            model: IMAGE_MODELS[0].value,
            prompt: currentMessage,
          },
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        streamAssistMessage = imageGeneration.revisedPrompt;
        streamAssistImage = imageGeneration.url;

        setAssistantMessage(imageGeneration.revisedPrompt);
        setAssistantImage(imageGeneration.url);
      } else {
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        const completionStream = await fetcher.post('/api/ai/completions', {
          body: {
            input: [...messages, ...(options?.regenerate ? [] : messagesForApi)].map(
              ({ content, role }) => ({
                content,
                role,
              }),
            ),
            model: currentModel,
            stream: true,
          },
          cache: 'no-cache',
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
          const lines = chunk.split('\n').filter((line) => line.trim());

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6));

              streamAssistMessage += data.delta;
              setAssistantMessage((prev) => prev + data.delta);
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        toast({
          description: String(error?.message),
          isError: true,
        });
      }
    } finally {
      saveLastMessages(currentUserMessage, {
        content: streamAssistMessage,
        id: uuidv4(),
        role: ChatCompletionRole.ASSISTANT,
        url: streamAssistImage,
      } as Message & { url: string });

      setIsSubmitting(false);
      setIsFetching(false);
    }
  };

  const handleAbortGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const saveLastMessages = async (
    userMessage: Message,
    assistMessage: Message & { url: string },
  ) => {
    const response = await fetcher.post('/api/chat', {
      body: {
        conversationId,
        image: isImageGeneration
          ? {
              messageId: assistMessage.id,
              model: IMAGE_MODELS[0].value,
              revisedPrompt: assistMessage.content,
              url: assistMessage.url,
            }
          : null,
        messages: [userMessage, assistMessage],
        model: currentModel,
      },
      responseType: 'json',
    });

    if (response?.messages) {
      const updatedChatMessages = {
        ...chatMessages,
        [conversationId]: [...chatMessages[conversationId], ...response.messages],
      };

      setAssistantMessage('');
      setAssistantImage('');
      setChatMessages(updatedChatMessages);
    }
  };

  return (
    <div className="flex h-full w-full">
      <div className="flex h-full w-full flex-col overflow-hidden bg-background outline-none">
        <div className="flex h-full w-full flex-col">
          {isShared && (
            <ChatSharedTopBar
              expiredAt={conversations?.[0]?.shared?.expiredAt}
              title={conversations?.[0]?.title}
            />
          )}
          {!isShared && (
            <ChatTopBar
              isEmbed={isEmbed}
              isSubmitting={isSubmitting}
              setAssistantMessage={setAssistantMessage}
            />
          )}
          <ChatBody
            assistantImage={assistantImage}
            assistantMessage={assistantMessage}
            introMessages={initialData.introMessages}
            isShared={isShared}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            sharedName={conversations?.[0]?.shared?.username}
          />
          {!isShared && (
            <ChatInput
              currenMessage={currentMessage}
              isSubmitting={isSubmitting}
              onAbortGenerating={handleAbortGenerating}
              onSubmit={handleSubmit}
              setCurrentMessage={setCurrentMessage}
            />
          )}
        </div>
      </div>
    </div>
  );
};
