'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui';
import { useToast } from '@/components/ui/use-toast';
import { CONVERSATION_ACTION } from '@/constants/chat';
import { useChatStore } from '@/hooks/use-chat-store';
import { fetcher } from '@/lib/fetcher';

export const ChatSideBarTop = () => {
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
    <div className="w-full p-4 border-b">
      <Button
        className="w-full"
        variant="secondary"
        disabled={isCreating}
        onClick={handleCreateConversation}
      >
        <Plus className="w-4 h-4 mr-2" />
        {t('add')}
      </Button>
    </div>
  );
};
