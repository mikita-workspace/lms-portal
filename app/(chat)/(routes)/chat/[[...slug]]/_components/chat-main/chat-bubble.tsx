'use client';

import { MoreHorizontal, RefreshCcw } from 'lucide-react';

import { CopyClipboard } from '@/components/common/copy-clipboard';
import { MarkdownText } from '@/components/common/markdown-text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { ChatCompletionRole } from '@/constants/open-ai';
import { getFallbackName } from '@/lib/utils';

type ChatBubbleProps = {
  isLastMessage?: boolean;
  isSubmitting?: boolean;
  message: { role: string; content: string };
  name: string;
  picture?: string | null;
  streamMessage?: string;
};

export const ChatBubble = ({
  isLastMessage,
  isSubmitting,
  message,
  name,
  picture,
  streamMessage,
}: ChatBubbleProps) => {
  const isAssistant = message.role === ChatCompletionRole.ASSISTANT;
  const text = streamMessage ?? message.content;

  return (
    <div className="pb-4 pt-2">
      <div className="flex gap-x-4">
        <Avatar className="border dark:border-muted-foreground">
          {!isAssistant && <AvatarImage src={picture || ''} />}
          {isAssistant && (
            <AvatarImage className="bg-white p-2 rounded-full" src="/assets/copilot.svg" />
          )}
          <AvatarFallback>{getFallbackName(name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="text-medium font-bold">{name}</span>
            {Boolean(isAssistant && streamMessage && isSubmitting) && (
              <MoreHorizontal className="w-6 h-6 animate-pulse" />
            )}
          </div>
          <MarkdownText text={text} />
          {isAssistant && !isSubmitting && (
            <div className="flex gap-x-2 mt-4">
              <CopyClipboard textToCopy={text} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};