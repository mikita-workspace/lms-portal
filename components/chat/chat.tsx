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
        <div
          className={cn(
            'relative rounded-full w-[40px] h-[40px] flex mt-[22px] justify-center transition-background ease-in-out duration-300',
          )}
        >
          <MessageSquareText className="h-5 w-5" />
        </div>
      </SheetTrigger>
      <SheetContent className="p-0 w-full h-full" side="right">
        <div className="relative">
          {!isReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background gap-y-2">
              <BiLoaderAlt className="h-8 w-8 animate-spin text-secondary-foreground" />
              <p className="text-sm">{t('loading')}</p>
            </div>
          )}
          <div style={{ width: '100%', height: '100vh', border: 'none' }}>
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
              title="Chat AI"
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
