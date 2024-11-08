import { Conversation } from '@/actions/chat/get-chat-conversations';

export const getChatMessages = (conversations: Conversation[]) =>
  conversations.reduce<Record<string, Conversation['messages']>>((acc, conversation) => {
    acc[conversation.id] = conversation.messages;

    return acc;
  }, {});
