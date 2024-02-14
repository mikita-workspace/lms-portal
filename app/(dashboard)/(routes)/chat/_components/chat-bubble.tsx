'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { getFallbackName } from '@/lib/utils';

type ChatBubbleProps = {
  message: string;
  name: string;
  picture?: string;
  timestamp?: string;
};

export const ChatBubble = ({ message, name, picture, timestamp }: ChatBubbleProps) => {
  return (
    <div className="pb-8 pt-2">
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
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
