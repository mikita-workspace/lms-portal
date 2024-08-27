'use client';

import { useTranslations } from 'next-intl';
import { SyntheticEvent } from 'react';
import { BsStars } from 'react-icons/bs';

import { Button, Textarea } from '@/components/ui';

type ChatInputProps = {
  currenMessage: string;
  isSubmitting?: boolean;
  onSubmit: (event: SyntheticEvent) => void;
  setCurrentMessage: (value: string) => void;
};

export const ChatInput = ({
  currenMessage,
  isSubmitting = false,
  onSubmit,
  setCurrentMessage,
}: ChatInputProps) => {
  const t = useTranslations('chatPage.input');

  return (
    <div className="w-full relative">
      <div className="flex flex-1 w-full flex-shrink-0 items-center justify-center">
        <div className="flex w-full h-full flex-col pb-2">
          <form
            className="mx-auto flex flex-row gap-3 lg:max-w-2xl xl:max-w-3xl w-full h-full px-4 relative"
            onSubmit={onSubmit}
          >
            <Textarea
              className="resize-none flex-1 pr-16 overflow-auto z-10"
              placeholder="Enter your message..."
              value={currenMessage}
              onChange={(event) => {
                setCurrentMessage(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key == 'Enter' && !event.shiftKey && !isSubmitting) {
                  event.preventDefault();
                  onSubmit(event);
                }
              }}
            />
            <Button
              className="absolute bottom-3 right-7 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:text-white font-medium z-10 px-2"
              disabled={isSubmitting || !currenMessage}
              type="submit"
              variant="outline"
            >
              <BsStars className="mr-1" />
              Ask
            </Button>
          </form>
          <div className="p-2 text-center text-xs text-muted-foreground z-10">{t('footer')}</div>
        </div>
      </div>
      <div className="h-[calc(100%+20px)] w-full bg-gradient-to-t from-neutral-50 dark:from-neutral-900 to-transparent absolute bottom-0 z-0"></div>
    </div>
  );
};
