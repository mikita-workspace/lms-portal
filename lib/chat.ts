import { Conversation } from '@/actions/chat/get-chat-conversations';

export const getChatMessages = (conversations: Conversation[]) =>
  conversations.reduce<Record<string, Conversation['messages']>>((acc, conversation) => {
    acc[conversation.id] = conversation.messages;

    return acc;
  }, {});

export const generateConversationTitle = () => {
  const words = [
    'Epic',
    'Quest',
    'Mystery',
    'Adventure',
    'Journey',
    'Legend',
    'Saga',
    'Fable',
    'Chronicle',
    'Odyssey',
    'Tale',
    'Story',
    'Secret',
    'Kingdom',
    'Empire',
    'Whisper',
    'Shadow',
    'Hero',
    'Crown',
    'Sword',
    'Castle',
    'Dream',
    'Fantasy',
  ];

  const titleLength = Math.floor(Math.random() * 3) + 2;
  let title = '';

  for (let i = 0; i < titleLength; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    title += words[randomIndex] + ' ';
  }

  return title.trim();
};
