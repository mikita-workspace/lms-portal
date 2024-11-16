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
        shared: true,
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
          shared: {
            expiredAt: null,
            isCreated: false,
            isOnlyAuth: false,
            isShared: false,
            link: '',
          },
        },
      ];
    }

    return conversations.map((conversation) => ({
      ...conversation,
      shared: {
        expiredAt: conversation.shared?.expireAt,
        isCreated: Boolean(conversation.shared),
        isOnlyAuth: conversation.shared?.isOnlyAuth ?? false,
        isShared: conversation.shared?.isActive ?? false,
        link: conversation.shared?.link ?? '',
      },
    }));
  } catch (error) {
    console.error('[GET_CHAT_CONVERSATIONS]', error);

    return [];
  }
};
