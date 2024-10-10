'use client';

import { Check, ChevronsUpDown, StopCircle } from 'lucide-react';
import { SyntheticEvent, useState } from 'react';
import { GrClearOption } from 'react-icons/gr';
import { MdIosShare } from 'react-icons/md';

import {
  Button,
  Command,
  CommandGroup,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui';
import { ChatCompletionRole, OPEN_AI_MODELS } from '@/constants/open-ai';
import { useChatStore } from '@/hooks/use-chat-store';
import { useCurrentUser } from '@/hooks/use-current-user';
import { cn } from '@/lib/utils';

type ChatTopBarProps = {
  isSubmitting?: boolean;
  lastAssistantMessage: string;
  onAbortGenerating: () => void;
  onRegenerate: (event: SyntheticEvent) => void;
  setAssistantMessage: (value: string) => void;
};

export const ChatTopBar = ({
  isSubmitting = false,
  lastAssistantMessage,
  onAbortGenerating,
  // onRegenerate,
  setAssistantMessage,
}: ChatTopBarProps) => {
  const { user } = useCurrentUser();
  const { messages, currentModel, setCurrentModel, removeMessages } = useChatStore();

  const [open, setOpen] = useState(false);

  const handleShare = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify([
        ...messages,
        {
          role: ChatCompletionRole.ASSISTANT,
          content: lastAssistantMessage,
        },
      ]),
    )}`;

    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `${user?.name?.toLowerCase()?.replace(/\W/g, '-')}-ai-messages.json`;
    link.click();
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
                  ? OPEN_AI_MODELS.find((model) => model.value === currentModel)?.label
                  : 'Select model...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandGroup>
                  {OPEN_AI_MODELS.map((model) => (
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
            {isSubmitting && (
              <Button variant="outline" onClick={onAbortGenerating}>
                <StopCircle className="w-4 h-4" />
              </Button>
            )}
            {/* {!isSubmitting && Boolean(messages.length) && (
              <Button variant="outline" onClick={onRegenerate}>
                <RefreshCcw className="w-4 h-4" />
              </Button>
            )} */}
            <Button
              variant="outline"
              disabled={isSubmitting || !messages.length}
              onClick={() => {
                removeMessages();
                setAssistantMessage('');
              }}
            >
              <GrClearOption className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              disabled={isSubmitting || !messages.length}
              onClick={handleShare}
            >
              <MdIosShare className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
