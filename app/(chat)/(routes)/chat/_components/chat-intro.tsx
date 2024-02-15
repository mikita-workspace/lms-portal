'use client';

import { ChatCompletionUserMessageParam } from 'openai/resources/index.mjs';

import { ChatCompletionRole } from '@/constants/open-ai';
import { useChatStore } from '@/hooks/use-chat-store';

type ChatIntroProps = {
  introMessages: string[];
};

export const ChatIntro = ({ introMessages }: ChatIntroProps) => {
  const mapQuestion = (value: string) => {
    const random = Math.floor(Math.random() * 3) + 3;
    const words = value.replace(/\W/g, '-').split('-');

    return {
      head: words.slice(0, random).join(' '),
      tail: `${words.slice(random, words.length - 1).join(' ')}?`,
    };
  };

  const handleInitialMessage = useChatStore((state) => state.addMessages);

  return (
    <div className="h-full flex flex-col justify-end">
      <div className="mx-auto grid m:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-2 lg:max-w-2xl xl:max-w-3xl w-full pb-6 px-4">
        {introMessages.slice(0, 2).map((message, index) => {
          const { head, tail } = mapQuestion(message);

          return (
            <button
              key={index}
              className="group hover:shadow-sm transition duration-300 border rounded-lg w-full flex flex-col overflow-hidden p-4 h-[70px] dark:hover:bg-neutral-900 hover:hover:bg-neutral-50 hover:cursor-pointer"
              onClick={() =>
                handleInitialMessage([
                  {
                    content: message,
                    role: ChatCompletionRole.USER as unknown as ChatCompletionUserMessageParam['role'],
                  },
                ])
              }
            >
              <div className="truncate font-semibold text-sm">{head}</div>
              <div className="truncate text-secondary-foreground text-xs">{tail}</div>
            </button>
          );
        })}
        {introMessages.slice(2).map((message, index) => {
          const { head, tail } = mapQuestion(message);

          return (
            <button
              key={index}
              className="group hover:shadow-sm transition duration-300 border rounded-lg w-full flex-col overflow-hidden p-4 h-[70px] dark:hover:bg-neutral-900 hover:hover:bg-neutral-50 hover:cursor-pointer md:flex hidden"
              onClick={() =>
                handleInitialMessage([
                  {
                    content: message,
                    role: ChatCompletionRole.USER as unknown as ChatCompletionUserMessageParam['role'],
                  },
                ])
              }
            >
              <div className="truncate font-semibold text-sm">{head}</div>
              <div className="truncate text-secondary-foreground text-xs">{tail}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
