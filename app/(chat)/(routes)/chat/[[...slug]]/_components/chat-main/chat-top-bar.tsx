'use client';

import { Check, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { GrClearOption } from 'react-icons/gr';

import {
  Button,
  Command,
  CommandGroup,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui';
import { useToast } from '@/components/ui/use-toast';
import { AI_PROVIDER_LABEL } from '@/constants/ai';
import { CONVERSATION_ACTION } from '@/constants/chat';
import { useAppConfigStore } from '@/hooks/store/use-app-config-store';
import { useChatStore } from '@/hooks/store/use-chat-store';
import { useCurrentUser } from '@/hooks/use-current-user';
import { fetcher } from '@/lib/fetcher';
import { isOwner } from '@/lib/owner';
import { cn } from '@/lib/utils';

type ChatTopBarProps = {
  isEmbed?: boolean;
  isSubmitting?: boolean;
  setAssistantMessage: (value: string) => void;
};

export const ChatTopBar = ({
  isEmbed = false,
  isSubmitting = false,
  setAssistantMessage,
}: ChatTopBarProps) => {
  const t = useTranslations('chat.top-bar');

  const { toast } = useToast();

  const { user } = useCurrentUser();
  const {
    chatMessages,
    conversationId,
    currentModel,
    isFetching,
    setChatMessages,
    setCurrentModel,
    setCurrentModelLabel,
    setIsFetching,
  } = useChatStore();
  const { config: appConfig } = useAppConfigStore((state) => ({
    config: state.config,
  }));

  const [open, setOpen] = useState(false);

  const TEXT_MODELS = appConfig?.ai?.['text-models'] ?? [];

  const messages = chatMessages[conversationId] ?? [];
  const models = isOwner(user?.userId) ? TEXT_MODELS : TEXT_MODELS.slice(0, 2);

  const handleDeleteMessages = async () => {
    setIsFetching(true);

    try {
      const updatedChatMessages = {
        ...chatMessages,
        [conversationId]: [],
      };

      await fetcher.patch(
        `/api/chat/conversations/${conversationId}?action=${CONVERSATION_ACTION.EMPTY_MESSAGES}`,
      );

      setAssistantMessage('');
      setChatMessages(updatedChatMessages);
    } catch (error) {
      toast({ isError: true });
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className={cn('w-full h-[75px]', !messages.length && 'h-full')}>
      <div className="flex flex-1 flex-col text-base md:px-5 lg:px-1 xl:px-5 mx-auto gap-3 md:max-w-3xl lg:max-w-[40rem] xl:max-w-4xl pt-4 px-4">
        <div className="flex items-center justify-between w-full gap-x-2">
          {!isEmbed && (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[140px] justify-between truncate"
                >
                  {currentModel
                    ? models.find((model) => model.value === currentModel)?.label
                    : models[0]?.label}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[160px] p-0">
                <Command>
                  <CommandGroup heading={t('models')}>
                    {models.map((model) => (
                      <CommandItem
                        key={model.value}
                        value={model.value}
                        onSelect={(currentValue) => {
                          const value = currentValue === currentModel ? '' : currentValue;

                          setCurrentModel(value);
                          setCurrentModelLabel(model.label);
                          setOpen(false);
                        }}
                      >
                        <div className="flex">
                          <Check
                            className={cn(
                              'mr-2 mt-1 h-4 w-4',
                              currentModel === model.value ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                          <div className="flex flex-col">
                            <p className="font-semibold">{model.label}</p>
                            <p className="text-xs text-muted-foreground">
                              {
                                AI_PROVIDER_LABEL[
                                  appConfig?.ai.provider as keyof typeof AI_PROVIDER_LABEL
                                ]
                              }
                            </p>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          )}
          {!isEmbed && (
            <div className="flex gap-1">
              <Button
                variant="outline"
                disabled={isSubmitting || isFetching || !messages.length}
                onClick={handleDeleteMessages}
              >
                <GrClearOption className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
