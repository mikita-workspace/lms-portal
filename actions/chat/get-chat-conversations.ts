'use server';

import { getTranslations } from 'next-intl/server';

import { db } from '@/lib/db';

import { getCurrentUser } from '../auth/get-current-user';

export const getChatConversations = async (conversationId?: string) => {
  try {
    const user = await getCurrentUser();
    const t = await getTranslations('chat.conversation');

    const conversations = await db.chatConversation.findMany({
      where: { userId: user?.userId },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, title: true, messages: true },
    });

    const messages =
      conversations.find((conversation) => conversation.id === conversationId)?.messages ?? [];

    if (!conversations.length) {
      const newChatConversation = await db.chatConversation.create({
        data: {
          title: t('title', { order: 1 }),
          userId: user?.userId,
        },
        select: {
          id: true,
          title: true,
        },
      });

      return {
        conversations: [{ id: newChatConversation.id, title: newChatConversation.title }],
        messages: [],
      };
    }

    return { conversations, messages };
  } catch (error) {
    console.error('[GET_CHAT_CONVERSATIONS]', error);

    return { conversations: [], messages: [] };
  }
};
