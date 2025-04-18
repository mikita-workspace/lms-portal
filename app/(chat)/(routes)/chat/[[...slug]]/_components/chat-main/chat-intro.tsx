'use client';

import { motion } from 'framer-motion';
import { memo, SyntheticEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { splitIntoWords } from '@/lib/utils';

import { ChatGreeting } from './chat-greeting';

type ChatIntroProps = {
  introMessages: string[];
  onSubmit: (
    event: SyntheticEvent,
    options?: {
      userMessage?: string;
    },
  ) => void;
};

const ChatIntroComponent = ({ introMessages, onSubmit }: ChatIntroProps) => {
  const mapQuestion = (value: string) => {
    const index = 4;
    const words = splitIntoWords(value);

    return {
      head: words.slice(0, index).join(' '),
      tail: `${words.slice(index, words.length - 1).join(' ')}?`,
    };
  };

  return (
    <div className="h-full flex flex-col justify-center">
      <ChatGreeting />
      <div className="mx-auto grid m:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-2 lg:max-w-2xl xl:max-w-4xl w-full pb-6 px-4">
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
        {introMessages.slice(2).map((message, index) => {
          const { head, tail } = mapQuestion(message);

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.05 * index }}
              key={uuidv4()}
              className={index > 1 ? 'hidden sm:block' : 'block'}
            >
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
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

ChatIntroComponent.displayName = 'ChatIntro';

export const ChatIntro = memo(ChatIntroComponent);
