'use client';

import { ChatMessage } from '@prisma/client';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { SyntheticEvent, useState } from 'react';

import { useToast } from '@/components/ui/use-toast';
import { useChatStore } from '@/hooks/store/use-chat-store';
import { fetcher } from '@/lib/fetcher';
import { cn } from '@/lib/utils';

const enum Feedback {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
}

type ChatFeedback = {
  className?: string;
  disabled?: boolean;
  messageId?: string;
  state?: string | null;
};

export const ChatFeedback = ({ className, disabled, messageId, state }: ChatFeedback) => {
  const { toast } = useToast();

  const { chatMessages, setChatMessages } = useChatStore((state) => ({
    chatMessages: state.chatMessages,
    setChatMessages: state.setChatMessages,
  }));

  const [isFetching, setIsFetching] = useState(false);
  const [clicked, setClicked] = useState({
    [Feedback.POSITIVE]: false,
    [Feedback.NEGATIVE]: false,
  });

  const handleClick = async (event: SyntheticEvent & { currentTarget: { name: string } }) => {
    const feedback = event.currentTarget.name;

    setClicked((prev) => ({ ...prev, [feedback]: true }));

    setTimeout(() => {
      setClicked((prev) => ({ ...prev, [feedback]: false }));
    }, 1000);

    setIsFetching(true);

    try {
      const response = await fetcher.post('/api/chat/feedback', {
        responseType: 'json',
        body: { messageId, feedback },
      });

      const conversationId = response.message.conversationId;

      const updatedChatMessages = {
        ...chatMessages,
        [conversationId]: chatMessages[conversationId].map((message) =>
          message.id === messageId
            ? {
                ...message,
                feedback: {
                  ...(message as ChatMessage & { feedback: ChatFeedback })?.feedback,
                  feedback: response.feedback,
                },
              }
            : message,
        ),
      };

      setChatMessages(updatedChatMessages);
    } catch (error) {
      toast({ isError: true });
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="flex gap-x-3">
      <button onClick={handleClick} disabled={disabled || isFetching} name={Feedback.POSITIVE}>
        <ThumbsUp
          className={cn(
            'h-4 w-4 hover:text-green-500 transition-all duration-300',
            state === Feedback.POSITIVE && 'text-green-500',
            clicked[Feedback.POSITIVE] ? 'animate-spin-once' : '',
            className,
          )}
        />
      </button>
      <button onClick={handleClick} disabled={disabled || isFetching} name={Feedback.NEGATIVE}>
        <ThumbsDown
          className={cn(
            'h-4 w-4 hover:text-red-500 transition-all duration-300',
            state === Feedback.NEGATIVE && 'text-red-500',
            clicked[Feedback.NEGATIVE] ? 'animate-spin-once' : '',
            className,
          )}
        />
      </button>
    </div>
  );
};
