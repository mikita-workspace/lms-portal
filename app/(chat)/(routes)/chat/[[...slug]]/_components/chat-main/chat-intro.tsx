'use client';

import { SyntheticEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { splitIntoWords } from '@/lib/utils';

type ChatIntroProps = {
  introMessages: string[];
  onSubmit: (
    event: SyntheticEvent,
    options?: {
      userMessage?: string;
    },
  ) => void;
};

export const ChatIntro = ({ introMessages, onSubmit }: ChatIntroProps) => {
  const mapQuestion = (value: string) => {
    const index = 4;
    const words = splitIntoWords(value);

    return {
      head: words.slice(0, index).join(' '),
      tail: `${words.slice(index, words.length - 1).join(' ')}?`,
    };
  };

  return (
    <div className="h-full flex flex-col justify-end">
      <div className="mx-auto grid m:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-2 lg:max-w-2xl xl:max-w-3xl w-full pb-6 px-4">
        {introMessages.slice(0, 2).map((message) => {
          const { head, tail } = mapQuestion(message);

          return (
            <div
              aria-hidden="true"
              key={uuidv4()}
              className="group hover:shadow-sm transition duration-300 border rounded-lg w-full flex flex-col overflow-hidden p-4 h-[70px] dark:hover:bg-neutral-900 hover:hover:bg-neutral-50 hover:cursor-pointer"
              onClick={(event) => {
                onSubmit(event, { userMessage: message });
              }}
            >
              <div className="truncate font-semibold text-sm">{head}</div>
              <div className="truncate text-secondary-foreground text-xs">{tail}</div>
            </div>
          );
        })}
        {introMessages.slice(2).map((message) => {
          const { head, tail } = mapQuestion(message);

          return (
            <div
              aria-hidden="true"
              key={uuidv4()}
              className="group hover:shadow-sm transition duration-300 border rounded-lg w-full flex-col overflow-hidden p-4 h-[70px] dark:hover:bg-neutral-900 hover:hover:bg-neutral-50 hover:cursor-pointer md:flex hidden"
              onClick={(event) => {
                onSubmit(event, { userMessage: message });
              }}
            >
              <div className="truncate font-semibold text-sm">{head}</div>
              <div className="line-clamp-1 text-secondary-foreground text-xs">{tail}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
