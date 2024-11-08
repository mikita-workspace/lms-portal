'use client';

import { ArrowRightToLine, SquareArrowOutUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { absoluteUrl, cn } from '@/lib/utils';

import { PrettyLoader } from '../loaders/pretty-loader';
import { Button, Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui';

export const Chat = () => {
  const [open, setOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

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
            <div className="fixed pt-4 px-4 flex gap-x-1">
              <SheetClose asChild>
                <Button className="w-full" variant="outline">
                  <ArrowRightToLine className="h-4 w-4" />
                </Button>
              </SheetClose>
              <Link href={absoluteUrl('/chat')} target="_blank">
                <Button className="w-full" variant="outline">
                  <SquareArrowOutUpRight className="h-4 w-4" />
                </Button>
              </Link>
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
