'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

import { Conversation } from '@/actions/chat/get-chat-conversations';
import {
  Button,
  Command,
  CommandGroup,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui';
import { useChatStore } from '@/hooks/store/use-chat-store';
import { cn } from '@/lib/utils';

type ChatConversationSwitchProps = { conversations?: Conversation[] };

export const ChatConversationSwitch = ({ conversations = [] }: ChatConversationSwitchProps) => {
  const { conversationId, setConversationId } = useChatStore();

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex-1" asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[180px] justify-between truncate"
        >
          {conversationId
            ? conversations.find((conversation) => conversation.id === conversationId)?.title
            : 'Select conversation...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandGroup>
            {conversations.map((conversation) => (
              <CommandItem
                key={conversation.id}
                value={conversation.id}
                onSelect={(currentValue) => {
                  const value = currentValue === conversationId ? '' : currentValue;

                  setConversationId(value);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    conversationId === conversation.id ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {conversation.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
