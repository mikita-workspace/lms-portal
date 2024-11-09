'use client';

import { MoreHorizontal, Pencil, Share, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';

type ConversationActionsProps = {
  id: string;
  setEditTitleId: (id: string) => void;
};

export const ConversationActions = ({ id, setEditTitleId }: ConversationActionsProps) => {
  const t = useTranslations('chat.conversation');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-4 w-8 p-0 outline-none" variant="ghost">
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
          // disabled={id === conversationId}
          disabled
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {t('remove')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
