'use client';

import { Check, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { GetAppConfig } from '@/actions/configs/get-app-config';
import {
  Button,
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui';
import { useAppConfigStore } from '@/hooks/store/use-app-config-store';
import { useChatStore } from '@/hooks/store/use-chat-store';
import { useCurrentUser } from '@/hooks/use-current-user';
import { cn } from '@/lib/utils';

type Model = GetAppConfig['ai'][0]['text-models'][0];

type CommandItemsProps = {
  callback: (value: { currentModel: string; currentModelLabel: string; isOpen: boolean }) => void;
  currentModel: string;
  models: Model[];
};

type ChatTopBarProps = {
  isEmbed?: boolean;
};

const CommandItems = ({ callback, currentModel, models }: CommandItemsProps) => {
  const { user } = useCurrentUser();

  return models.map((model) => (
    <CommandItem
      disabled={!user?.hasSubscription}
      key={model.value}
      value={model.value}
      onSelect={(currentValue) => {
        const value = currentValue === currentModel ? '' : currentValue;

        callback({ currentModel: value, currentModelLabel: model.label, isOpen: false });
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
          <p className="text-xs text-muted-foreground">{model.owner}</p>
        </div>
      </div>
    </CommandItem>
  ));
};

export const ChatTopBar = ({ isEmbed = false }: ChatTopBarProps) => {
  const t = useTranslations('chat.top-bar');

  const { chatMessages, conversationId, currentModel, setCurrentModel, setCurrentModelLabel } =
    useChatStore();
  const { config: appConfig } = useAppConfigStore((state) => ({
    config: state.config,
  }));

  const [open, setOpen] = useState(false);

  const [paidModels, freeModels] = (appConfig?.ai.flatMap((ai) => ai['text-models']) ?? []).reduce<
    [Model[], Model[], Model[]]
  >(
    (acc, model) => {
      if (model.isSubscription) {
        acc[0].push(model);
      } else {
        acc[1].push(model);
      }
      return acc;
    },
    [[], [], []],
  );

  const messages = chatMessages[conversationId] ?? [];

  const handleCommandItemsCallback = ({
    currentModel,
    currentModelLabel,
    isOpen,
  }: {
    currentModel: string;
    currentModelLabel: string;
    isOpen: boolean;
  }) => {
    setCurrentModel(currentModel);
    setCurrentModelLabel(currentModelLabel);
    setOpen(isOpen);
  };

  return (
    <div className={cn('w-full h-[75px]', !messages.length && 'h-full')}>
      <div className="flex flex-1 flex-col text-base md:px-5 lg:px-1 xl:px-5 mx-auto gap-3 md:max-w-3xl lg:max-w-[40rem] xl:max-w-4xl pt-4 px-4">
        <div className="flex items-center justify-center w-full gap-x-2">
          {!isEmbed && (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  aria-expanded={open}
                  className="w-[140px] justify-between truncate"
                >
                  {currentModel
                    ? [...freeModels, ...paidModels].find((model) => model.value === currentModel)
                        ?.label
                    : freeModels[0]?.label}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[160px] p-0">
                <Command>
                  <CommandList>
                    <CommandGroup heading={t('models')}>
                      <CommandItems
                        callback={handleCommandItemsCallback}
                        currentModel={currentModel}
                        models={freeModels}
                      />
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading={'Preview'}>
                      <CommandItems
                        callback={handleCommandItemsCallback}
                        currentModel={currentModel}
                        models={paidModels}
                      />
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};
