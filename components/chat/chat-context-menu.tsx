'use client';

import { MoreHorizontal, SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { absoluteUrl } from '@/lib/utils';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui';

export const ChatContextMenu = () => {
  const t = useTranslations('chat.conversation');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-full" variant="outline">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link href={absoluteUrl('/chat')} target="_blank">
          <DropdownMenuItem className="hover:cursor-pointer">
            <SquareArrowOutUpRight className="h-4 w-4 mr-2" />
            <span>{t('view')}</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
