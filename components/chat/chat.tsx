'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { useChatStore } from '@/hooks/store/use-chat-store';
import { absoluteUrl, cn } from '@/lib/utils';

import { PrettyLoader } from '../loaders/pretty-loader';
import { Button, Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui';
import { ChatContextMenu } from './chat-context-menu';

export const Chat = () => {
  const [open, setOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const { currentModelLabel } = useChatStore((state) => ({
    currentModelLabel: state.currentModelLabel,
  }));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="hover:opacity-75 transition duration-300">
        <button
          className={cn(
            'flex w-full text-sm text-muted-foreground items-center p-2 hover:bg-muted rounded-lg transition-background group duration-300 ease-in-out border hover:text-primary dark:border-muted-foreground',
            open && 'bg-muted text-primary font-medium',
          )}
        >
          <div className="h-5 w-5 flex justify-center items-center">
            <Image src="/assets/copilot.svg" alt="Copilot Logo" height={18} width={18} priority />
          </div>
        </button>
      </SheetTrigger>
      <SheetContent className="p-0 w-full" side="rightCopilot">
        <div className="relative h-full">
          {!isReady && <PrettyLoader isCopilot />}
          {isReady && (
            <div className="fixed py-2 px-4 flex gap-x-1 border-b justify-between sm:max-w-md w-full items-center">
              <div>
                <p className={'font-semibold text-base text-neutral-700 dark:text-neutral-300'}>
                  Nova Copilot
                </p>
                <p className={'text-muted-foreground text-xs'}>{currentModelLabel}</p>
              </div>
              <div className="flex gap-x-2">
                <ChatContextMenu />
                <SheetClose asChild>
                  <Button className="w-full" variant="outline">
                    <X className="h-4 w-4" />
                  </Button>
                </SheetClose>
              </div>
            </div>
          )}
          <iframe
            onLoad={() => setIsReady(true)}
            src={absoluteUrl('/chat/embed')}
            style={{ width: '100%', height: '100%', border: 'none' }}
            height="100%"
            width="100%"
            title="Nova Copilot"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
