'use client';

import { MoreHorizontal, Pencil, Share, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import { useToast } from '@/components/ui/use-toast';
import { useChatStore } from '@/hooks/use-chat-store';
import { fetcher } from '@/lib/fetcher';

type ConversationActionsProps = {
  id: string;
  setEditTitleId: (id: string) => void;
};

export const ConversationActions = ({ id, setEditTitleId }: ConversationActionsProps) => {
  const { toast } = useToast();
  const t = useTranslations('chat.conversation');

  const router = useRouter();

  const { conversationId } = useChatStore();

  const [isFetching, setIsFetching] = useState(false);

  const handleRemoveConversation = async () => {
    setIsFetching(true);

    try {
      await fetcher.delete(`/api/chat/conversation/${id}`);
      router.refresh();
    } catch (error) {
      toast({ isError: true });
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-4 w-8 p-0 outline-none" variant="ghost" disabled={isFetching}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => setEditTitleId(id)}
          disabled
        >
          <Pencil className="h-4 w-4  mr-2" />
          {t('edit')}
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:cursor-pointer" disabled>
          <Share className="h-4 w-4  mr-2" />
          {t('share')}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:cursor-pointer text-red-500"
          onClick={handleRemoveConversation}
          disabled={id === conversationId || isFetching}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {t('remove')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
