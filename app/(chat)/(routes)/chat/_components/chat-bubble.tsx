'use client';

import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { getFallbackName } from '@/lib/utils';

type ChatBubbleProps = {
  message: ChatCompletionMessageParam;
  name: string;
  picture?: string | null;
  timestamp?: string;
};

export const ChatBubble = ({ message, name, picture }: ChatBubbleProps) => {
  return (
    <div className="pb-4 pt-2">
      <div className="flex gap-x-4">
        <div>
          <Avatar>
            {picture && <AvatarImage src={picture} />}
            <AvatarFallback>{getFallbackName(name)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col">
          <div className="space-x-2">
            <span className="text-medium font-bold">{name}</span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span>
          </div>
          <p className="text-sm prose dark:prose-invert prose-a:text-accent-primary prose-a:no-underline hover:prose-a:underline">
            {message.content as string}
          </p>
        </div>
      </div>
    </div>
  );
};
