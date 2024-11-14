'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ChatConversationModal } from '@/components/modals/chat-conversation-modal';
import { Button } from '@/components/ui';
import { LIMIT_CONVERSATIONS } from '@/constants/chat';

type ChatSideBarTopProps = {
  amountOfConversations?: number;
};
export const ChatSideBarTop = ({ amountOfConversations = 1 }: ChatSideBarTopProps) => {
  const t = useTranslations('chat.conversation');

  const isLimitReached = amountOfConversations >= LIMIT_CONVERSATIONS;

  return (
    <div className="w-full px-4 pb-2 pt-4 border-b">
      <ChatConversationModal>
        <Button className="w-full" variant="secondary" disabled={isLimitReached}>
          <Plus className="w-4 h-4 mr-2" />
          {t('add')}
        </Button>
      </ChatConversationModal>
      <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
        <span>{t('conversations')}</span>
        <span>
          {amountOfConversations}/{LIMIT_CONVERSATIONS}
        </span>
      </div>
    </div>
  );
};
