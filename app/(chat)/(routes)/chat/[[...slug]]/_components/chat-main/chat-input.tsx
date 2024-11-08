'use client';

import { StopCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SyntheticEvent } from 'react';
import { BsStars } from 'react-icons/bs';

import { Button, Textarea } from '@/components/ui';
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
              disabled={isSubmitting}
              placeholder={t('enterMessage')}
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
              className={cn(
                'absolute bottom-3 right-7 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:text-white font-medium z-10 px-2',
                isSubmitting && 'w-12',
              )}
              disabled={!currenMessage && !isSubmitting}
              type={isSubmitting ? 'button' : 'submit'}
              variant="outline"
              onClick={isSubmitting ? onAbortGenerating : () => {}}
            >
              {isSubmitting && <StopCircle className="w-4 h-4" />}
              {!isSubmitting && (
                <>
                  <BsStars className="mr-1" />
                  {t('ask')}
                </>
              )}
            </Button>
          </form>
          <div className="p-2 text-center text-xs text-muted-foreground z-10">{t('footer')}</div>
        </div>
      </div>
      <div className="h-[calc(100%+20px)] w-full bg-gradient-to-t from-neutral-50 dark:from-neutral-900 to-transparent absolute bottom-0 z-0"></div>
    </div>
  );
};
