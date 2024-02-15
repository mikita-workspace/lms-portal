'use client';

import { Check, ChevronsUpDown, Save } from 'lucide-react';
import { useState } from 'react';
import { GrClearOption } from 'react-icons/gr';
import { MdIosShare } from 'react-icons/md';

import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui';
import { useChatStore } from '@/hooks/use-chat-store';
import { useCurrentUser } from '@/hooks/use-current-user';
import { cn } from '@/lib/utils';

const models = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
];

export const ChatTopBar = () => {
  const { user } = useCurrentUser();
  const messages = useChatStore((state) => state.messages);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('astro');

  const handleClear = useChatStore((state) => state.removeMessages);

  const handleShare = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(messages))}`;

    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `${user?.name?.toLowerCase()?.replace(/\W/g, '-')}-ai-messages.json`;
    link.click();
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-1 text-base md:px-5 lg:px-1 xl:px-5 mx-auto gap-3 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] pt-4 px-4">
        <div className="flex items-center justify-between w-full">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[180px] justify-between"
              >
                {value ? models.find((model) => model.value === value)?.label : 'Select model...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search model..." />
                <CommandEmpty>No model found.</CommandEmpty>
                <CommandGroup>
                  {models.map((model) => (
                    <CommandItem
                      key={model.value}
                      value={model.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? '' : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === model.value ? 'opacity-100' : 'opacity-0',
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
            <Button variant="outline" onClick={handleClear}>
              <GrClearOption className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={() => {}}>
              <Save className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <MdIosShare className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
