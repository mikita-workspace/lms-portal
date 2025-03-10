'use client';

import { SendHorizonal, StopCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SyntheticEvent, useState } from 'react';

import { Button, Textarea } from '@/components/ui';
import { LIMIT_CHAT_INPUT } from '@/constants/chat';
import { cn } from '@/lib/utils';

type ChatInputProps = {
  currenMessage: string;
  isSubmitting?: boolean;
  onAbortGenerating: () => void;
  onSubmit: (event: SyntheticEvent) => void;
  setCurrentMessage: (value: string) => void;
};

export const ChatInput = ({
  currenMessage,
  isSubmitting = false,
  onAbortGenerating,
  onSubmit,
  setCurrentMessage,
}: ChatInputProps) => {
  const t = useTranslations('chat.input');

  const [inputLength, setInputLength] = useState(0);

  return (
    <div className="w-full h-full relative flex items-end">
      <div className="flex flex-1 w-full flex-shrink-0">
        <div className="flex w-full h-full flex-col pb-2 px-4">
          <form
            className={cn(
              'mx-auto flex flex-col lg:max-w-2xl xl:max-w-4xl w-full h-full border rounded-sm z-10 focus-within:border-b-indigo-500 focus-within:border-b-2 transition-colors duration-200 ease-in-out',
              inputLength >= LIMIT_CHAT_INPUT && 'focus-within:border-b-red-600',
            )}
            onSubmit={onSubmit}
          >
            <Textarea
              className="resize-none overflow-auto z-10 border-none"
              disabled={isSubmitting}
              maxLength={LIMIT_CHAT_INPUT}
              placeholder={t('enterMessage')}
              value={currenMessage}
              onChange={(event) => {
                setCurrentMessage(event.target.value);
                setInputLength(event.target.value.length);
              }}
              onKeyDown={(event) => {
                if (event.key == 'Enter' && !event.shiftKey && !isSubmitting) {
                  event.preventDefault();
                  onSubmit(event);
                }
              }}
            />
            <div className="flex bg-background justify-between px-2 pb-4 pt-2 items-end">
              <div className="text-xs text-muted-foreground">
                {inputLength} / {LIMIT_CHAT_INPUT}
              </div>
              <Button
                className={cn(
                  'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:text-white font-medium z-10 px-2 text-sm',
                  isSubmitting && 'w-12',
                )}
                disabled={!currenMessage && !isSubmitting}
                type={isSubmitting ? 'button' : 'submit'}
                variant="outline"
                onClick={isSubmitting ? onAbortGenerating : () => {}}
              >
                {isSubmitting && <StopCircle className="w-4 h-4 mx-2" />}
                {!isSubmitting && <SendHorizonal className="w-4 h-4 mx-2" />}
              </Button>
            </div>
          </form>
          <div className="p-2 text-center text-xs text-muted-foreground z-10">{t('footer')}</div>
        </div>
      </div>
      <div className="h-[calc(100%+20px)] w-full bg-gradient-to-t from-neutral-50 dark:from-neutral-900 to-transparent absolute bottom-0 z-0"></div>
    </div>
  );
};
