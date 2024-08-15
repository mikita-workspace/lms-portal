'use client';

import { MarkdownText } from '@/components/common/markdown-text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { ChatCompletionRole } from '@/constants/open-ai';
import { getFallbackName } from '@/lib/utils';

type ChatBubbleProps = {
  message: { role: string; content: string };
  name: string;
  picture?: string | null;
  streamMessage?: string;
};

export const ChatBubble = ({ message, name, picture, streamMessage }: ChatBubbleProps) => {
  const isAssistant = message.role === ChatCompletionRole.ASSISTANT;

  return (
    <div className="pb-4 pt-2">
      <div className="flex gap-x-4">
        <div>
          <Avatar>
            {!isAssistant && <AvatarImage src={picture || ''} />}
            {isAssistant && (
              <AvatarImage
                className="bg-white p-1.5 border rounded-full"
                src="/assets/openai.svg"
              />
            )}
            <AvatarFallback>{getFallbackName(name)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col">
          <div className="space-x-2">
            <span className="text-medium font-bold">{name}</span>
          </div>
          <MarkdownText text={streamMessage ?? message.content} />
        </div>
      </div>
    </div>
  );
};
