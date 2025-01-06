'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
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
import { CONVERSATION_ACTION } from '@/constants/chat';
import { OPEN_AI_MODELS } from '@/constants/open-ai';
import { useChatStore } from '@/hooks/store/use-chat-store';
import { useCurrentUser } from '@/hooks/use-current-user';
import { fetcher } from '@/lib/fetcher';
import { isOwner } from '@/lib/owner';
import { cn } from '@/lib/utils';

type ChatTopBarProps = {
  isSubmitting?: boolean;
  setAssistantMessage: (value: string) => void;
};

export const ChatTopBar = ({ isSubmitting = false, setAssistantMessage }: ChatTopBarProps) => {
  const { toast } = useToast();

  const { user } = useCurrentUser();
  const {
    chatMessages,
    conversationId,
    currentModel,
    isFetching,
    setChatMessages,
    setCurrentModel,
    setIsFetching,
  } = useChatStore();

  const [open, setOpen] = useState(false);

  const messages = chatMessages[conversationId] ?? [];
  const models = isOwner(user?.userId) ? OPEN_AI_MODELS : OPEN_AI_MODELS.slice(0, 2);

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
      <div className="flex flex-1 text-base md:px-5 lg:px-1 xl:px-5 mx-auto gap-3 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] pt-4 px-4">
        <div className="flex items-center justify-between w-full">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[180px] justify-between truncate"
              >
                {currentModel
                  ? models.find((model) => model.value === currentModel)?.label
                  : 'Select model...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandGroup>
                  {models.map((model) => (
                    <CommandItem
                      key={model.value}
                      value={model.value}
                      onSelect={(currentValue) => {
                        const value = currentValue === currentModel ? '' : currentValue;

                        setCurrentModel(value);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          currentModel === model.value ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {model.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="flex gap-1">
            <Button
              variant="outline"
              disabled={isSubmitting || isFetching || !messages.length}
              onClick={handleDeleteMessages}
            >
              <GrClearOption className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
