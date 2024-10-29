'use client';

import { ArrowRightToLine, MessageSquareText, SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';

import { absoluteUrl, cn } from '@/lib/utils';

import { Button, Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui';

export const Chat = () => {
  const t = useTranslations('app');

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
          <MessageSquareText className="h-5 w-5 font-medium" />
        </button>
      </SheetTrigger>
      <SheetContent className="p-0 w-full" side="right">
        <div className="relative h-full">
          {!isReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background gap-y-2">
              <BiLoaderAlt className="h-8 w-8 animate-spin text-secondary-foreground" />
              <p className="text-sm">{t('loading')}</p>
            </div>
          )}
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
            src={absoluteUrl('/chat/iframe')}
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
