'use client';

import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui';
import { CONVERSATION_ACTION } from '@/constants/chat';
import { fetcher } from '@/lib/fetcher';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { useChatStore } from '@/hooks/use-chat-store';

export const ChatSideBarBottom = () => {
  const { toast } = useToast();
  const router = useRouter();

  const t = useTranslations('chat.conversation');

  const { setConversationId } = useChatStore();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConversations = async () => {
    setIsDeleting(true);

    try {
      await fetcher.post(`/api/chat/conversation?action=${CONVERSATION_ACTION.DELETE_ALL}`);
    } catch (error) {
      toast({ isError: true });
    } finally {
      setIsDeleting(false);
      setConversationId('');
    }

    router.refresh();
  };

  return (
    <div className="w-full p-4 border-t">
      <ConfirmModal onConfirm={handleDeleteConversations}>
        <Button
          className="w-full"
          variant="secondary"
          disabled={isDeleting}
          onClick={handleDeleteConversations}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {t('delete-all')}
        </Button>
      </ConfirmModal>
    </div>
  );
};
