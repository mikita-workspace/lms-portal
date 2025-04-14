'use client';

import { ImageIcon, Paperclip, SendHorizonal, StopCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge, Button, Separator } from '@/components/ui';
import { useAppConfigStore } from '@/hooks/store/use-app-config-store';
import { useChatStore } from '@/hooks/store/use-chat-store';
import { cn } from '@/lib/utils';

type ChatInputFooterProps = {
  isDisabled?: boolean;
  isSubmitting?: boolean;
  onSendMessage: () => void;
};

export const ChatInputFooter = ({
  isDisabled,
  isSubmitting,
  onSendMessage,
}: ChatInputFooterProps) => {
  const t = useTranslations('chat.input');

  const { isImageGeneration, setIsImageGeneration } = useChatStore((state) => ({
    isImageGeneration: state.isImageGeneration,
    setIsImageGeneration: state.setIsImageGeneration,
  }));
  const { config: appConfig } = useAppConfigStore((state) => ({
    config: state.config,
  }));

  const IMAGE_MODELS = (appConfig?.ai?.['image-models'] as Record<string, string>[]) ?? [];

  return (
    <div className="flex bg-background justify-between px-2 py-2 items-center">
      <div className="text-xs text-muted-foreground flex items-center gap-x-2 pr-2">
        {isImageGeneration && (
          <Badge variant="secondary" className="rounded-sm px-1 font-normal line-clamp-2">
            {t('image-generation-mode', { model: IMAGE_MODELS[0].label })}
          </Badge>
        )}
      </div>
      <div className="flex items-center">
        <button
          type="button"
          className="mr-3"
          disabled={isSubmitting}
          onClick={() => setIsImageGeneration(!isImageGeneration)}
        >
          <ImageIcon
            className={cn(
              'w-4 h-4 text-muted-foreground transition-colors duration-300',
              isImageGeneration && 'text-purple-500',
            )}
          />
        </button>
        <button type="button" disabled={isSubmitting}>
          <Paperclip className="w-4 h-4 text-muted-foreground" />
        </button>
        <Separator orientation="vertical" className="mr-4 ml-2 h-6" />
        <Button
          className={cn(
            'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:text-white font-medium z-10 px-2 text-sm',
            isSubmitting && 'w-12',
          )}
          disabled={isDisabled || (isSubmitting && isImageGeneration)}
          type={isSubmitting ? 'button' : 'submit'}
          variant="outline"
          onClick={onSendMessage}
        >
          {isSubmitting && <StopCircle className="w-4 h-4 mx-2" />}
          {!isSubmitting && <SendHorizonal className="w-4 h-4 mx-2" />}
        </Button>
      </div>
    </div>
  );
};
