'use client';

import { Menu } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '../ui';

export const Chat = () => {
  return (
    <Sheet>
      <SheetTrigger className="pr-4 hover:opacity-75 transition duration-300">
        <Menu />
      </SheetTrigger>
      <SheetContent className="p-0 w-full" side="right">
        <div style={{ width: '100%', height: '100vh', border: 'none' }}>
          <iframe
            src="http://localhost:3000/chat?iframe=true"
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Embedded Page"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
