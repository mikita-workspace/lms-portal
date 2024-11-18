'use server';

import { getTranslations } from 'next-intl/server';

import { db } from '@/lib/db';

import { getCurrentUser } from '../auth/get-current-user';

export type Conversation = Awaited<ReturnType<typeof getChatConversations>>[0];

type GetChatConversations = { isEmbed?: boolean; sharedConversationId?: string };

export const getChatConversations = async ({
  isEmbed,
  sharedConversationId,
}: GetChatConversations) => {
  try {
    const user = await getCurrentUser();
    const t = await getTranslations('chat.conversation');

    if (sharedConversationId) {
      const shared = await db.chatSharedConversation.findUnique({
        where: {
          id: sharedConversationId,
        },
        include: {
          conversation: {
            include: {
              messages: true,
              shared: true,
              user: true,
            },
          },
        },
      });

      if (!shared) {
        return [];
      }

      const conversation = shared.conversation;

      return [
        {
          id: conversation.id,
          messages: conversation.messages,
          position: conversation.position,
          title: conversation.title,
          shared: {
            expiredAt: conversation.shared?.expireAt,
            id: conversation.shared?.id,
            isCreated: Boolean(conversation.shared),
            isOnlyAuth: conversation.shared?.isOnlyAuth ?? false,
            isShared: conversation.shared?.isActive ?? false,
            username: conversation.user?.name,
          },
        },
      ];
    }

    const conversations = await db.chatConversation.findMany({
      ...(isEmbed && { take: 1 }),
      where: { userId: user?.userId },
      orderBy: { position: 'asc' },
      select: {
        id: true,
        title: true,
        position: true,
        shared: true,
        user: true,
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
            id: null,
            expiredAt: null,
            isCreated: false,
            isOnlyAuth: false,
            isShared: false,
            username: '',
          },
        },
      ];
    }

    return conversations.map((conversation) => ({
      ...conversation,
      shared: {
        expiredAt: conversation.shared?.expireAt,
        id: conversation.shared?.id,
        isCreated: Boolean(conversation.shared),
        isOnlyAuth: conversation.shared?.isOnlyAuth ?? false,
        isShared: conversation.shared?.isActive ?? false,
        username: conversation.user?.name,
      },
    }));
  } catch (error) {
    console.error('[GET_CHAT_CONVERSATIONS]', error);

    return [];
  }
};
