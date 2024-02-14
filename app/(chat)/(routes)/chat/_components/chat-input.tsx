'use client';

import { Button, Textarea } from '@/components/ui';

export const ChatInput = () => {
  return (
    <div className="w-full relative">
      <div className="flex flex-1 w-full flex-shrink-0 items-center justify-center">
        <div className="flex w-full h-full flex-col pb-2">
          <form className="mx-auto flex flex-row gap-3 lg:max-w-2xl xl:max-w-3xl w-full h-full px-4 relative">
            <Textarea
              className="resize-none flex-1 pr-16 overflow-auto z-10"
              placeholder="Enter your message..."
            />
            <Button
              className="absolute bottom-3 right-7 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:text-white font-medium z-10"
              variant="outline"
              type="submit"
            >
              Ask
            </Button>
          </form>
          <div className="p-2 text-center text-xs text-secondary-foreground z-10">
            AI Chat can make mistakes. Consider checking important information.
          </div>
        </div>
      </div>
      <div className="h-[calc(100%+20px)] w-full bg-gradient-to-t from-neutral-50 dark:from-neutral-900 to-transparent absolute bottom-0 z-0"></div>
    </div>
  );
};
