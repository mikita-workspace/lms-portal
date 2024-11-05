'use client';

import { Text } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { useCallback, useEffect } from 'react';

import { getChatConversations } from '@/actions/chat/get-chat-conversations';
import { cn } from '@/lib/utils';

type ChatSideBarItemsProps = {
  conversations: Awaited<ReturnType<typeof getChatConversations>>;
};

export const ChatSideBarItems = ({ conversations }: ChatSideBarItemsProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasConversationId = Boolean(searchParams.get('conversationId'));

  const handleOnClick = useCallback(
    (id: string) => {
      const url = qs.stringifyUrl(
        {
          url: pathname,
          query: { conversationId: id },
        },
        { skipNull: true, skipEmptyString: true },
      );

      router.push(url);
    },
    [pathname, router],
  );

  useEffect(() => {
    if (!hasConversationId) {
      handleOnClick(conversations[0].id);
    }
  }, [conversations, handleOnClick, hasConversationId]);

  return conversations.map(({ id, title }) => {
    const isActive = searchParams.get('conversationId') === id;

    return (
      <button
        key={id}
        className={cn(
          'flex items-center gap-x-2 text-muted-foreground text-sm font-[500] pl-4 pr-2 transition-all duration-300 hover:bg-muted border-b last:border-none',
          isActive && 'text-primary bg-muted',
        )}
        type="button"
        onClick={() => handleOnClick(id)}
      >
        <div className="flex items-center gap-x-2 py-5">
          <Text
            className={cn('text-muted-foreground', isActive && 'text-primary animate-spin-once')}
            size={22}
          />
          <p className="text-left line-clamp-2">{title}</p>
        </div>
      </button>
    );
  });
};
