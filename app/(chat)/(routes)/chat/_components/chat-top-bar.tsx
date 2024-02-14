'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
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
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('astro');

  return (
    <div className="w-full h-full">
      <div className="flex flex-1 text-base md:px-5 lg:px-1 xl:px-5 mx-auto gap-3 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] first:pt-4 last:pb-6 px-4">
        <div className="flex items-center justify-between w-full">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
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
            <Button variant="outline">
              <GrClearOption className="w-4 h-4" />
            </Button>
            <Button variant="outline">
              <MdIosShare className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
