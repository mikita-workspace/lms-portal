'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui';
import { useToast } from '@/components/ui/use-toast';
import { CONVERSATION_ACTION } from '@/constants/chat';
import { useChatStore } from '@/hooks/use-chat-store';
import { fetcher } from '@/lib/fetcher';

export const ChatSideBarBottom = () => {
  const { toast } = useToast();
  const router = useRouter();

  const t = useTranslations('chat.conversation');

  const { setConversationId, setChatMessages } = useChatStore();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConversations = async () => {
    setIsDeleting(true);

    try {
      await fetcher.post(`/api/chat/conversations?action=${CONVERSATION_ACTION.DELETE_ALL}`, {
        responseType: 'json',
      });
    } catch (error) {
      toast({ isError: true });
    } finally {
      setIsDeleting(false);
      setConversationId('');
      setChatMessages({});
    }

    router.refresh();
  };

  return (
    <div className="w-full p-4 border-t">
      <ConfirmModal onConfirm={handleDeleteConversations}>
        <Button className="w-full" variant="secondary" disabled={isDeleting}>
          <Trash2 className="w-4 h-4 mr-2" />
          {t('delete-all')}
        </Button>
      </ConfirmModal>
    </div>
  );
};
