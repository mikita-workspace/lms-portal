'use server';

import { getTranslations } from 'next-intl/server';

import { db } from '@/lib/db';

import { getCurrentUser } from '../auth/get-current-user';

export type Conversation = Awaited<ReturnType<typeof getChatConversations>>[0];

export const getChatConversations = async (isEmbed = false) => {
  try {
    const user = await getCurrentUser();
    const t = await getTranslations('chat.conversation');

    const conversations = await db.chatConversation.findMany({
      ...(isEmbed && { take: 1 }),
      where: { userId: user?.userId },
      orderBy: { position: 'asc' },
      select: {
        id: true,
        title: true,
        position: true,
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversations.length) {
      const newChatConversation = await db.chatConversation.create({
        data: {
          position: 0,
          title: t('title', { order: 1 }),
          userId: user?.userId,
        },
        select: {
          id: true,
          position: true,
          title: true,
        },
      });

      return [
        {
          id: newChatConversation.id,
          messages: [],
          position: newChatConversation.position,
          title: newChatConversation.title,
        },
      ];
    }

    return conversations;
  } catch (error) {
    console.error('[GET_CHAT_CONVERSATIONS]', error);

    return [];
  }
};
