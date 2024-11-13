'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui';
import { useToast } from '@/components/ui/use-toast';
import { CONVERSATION_ACTION, LIMIT_CONVERSATIONS } from '@/constants/chat';
import { useChatStore } from '@/hooks/use-chat-store';
import { fetcher } from '@/lib/fetcher';

type ChatSideBarTopProps = {
  amountOfConversations?: number;
};
export const ChatSideBarTop = ({ amountOfConversations = 1 }: ChatSideBarTopProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const t = useTranslations('chat.conversation');

  const { setConversationId } = useChatStore();

  const [isCreating, setIsCreating] = useState(false);

  const handleCreateConversation = async () => {
    setIsCreating(true);

    try {
      const response = await fetcher.post(
        `/api/chat/conversation?action=${CONVERSATION_ACTION.NEW}`,
        { responseType: 'json' },
      );

      setConversationId(response?.id ?? '');
    } catch (error) {
      toast({ isError: true });
    } finally {
      setIsCreating(false);
    }

    router.refresh();
  };

  return (
    <div className="w-full px-4 pb-2 pt-4 border-b">
      <Button
        className="w-full"
        variant="secondary"
        disabled={isCreating || amountOfConversations >= LIMIT_CONVERSATIONS}
        onClick={handleCreateConversation}
      >
        <Plus className="w-4 h-4 mr-2" />
        {t('add')}
      </Button>
      <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
        <span>Conversations</span>
        <span>
          {amountOfConversations}/{LIMIT_CONVERSATIONS}
        </span>
      </div>
    </div>
  );
};
