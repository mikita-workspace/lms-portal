'use client';

import { MessagesSquare } from 'lucide-react';
import { useState } from 'react';

import { absoluteUrl, cn } from '@/lib/utils';

import { Sheet, SheetContent, SheetTrigger } from '../ui';

export const Chat = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="pr-4 hover:opacity-75 transition duration-300">
        <div
          className={cn(
            'relative rounded-full w-[40px] h-[40px] flex items-center justify-center transition-background ease-in-out duration-300',
            open ? 'bg-muted ' : 'hover:bg-muted ',
          )}
        >
          <MessagesSquare className="h-5 w-5" />
        </div>
      </SheetTrigger>
      <SheetContent className="p-0 w-full" side="right">
        <div style={{ width: '100%', height: '100vh', border: 'none' }}>
          <iframe
            src={absoluteUrl('/chat/iframe')}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Chat AI"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
