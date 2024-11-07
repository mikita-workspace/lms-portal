import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Conversation } from '@/actions/chat/get-chat-conversations';
import { DEFAULT_MODEL } from '@/constants/open-ai';

type Message = { role: string; content: string; timestamp: number };
type ChatMessages = Record<string, Conversation['messages']>;

type ChatStore = {
  chatMessages: ChatMessages;
  conversationId: string;
  currentModel: string;
  messages: Message[];
  removeMessages: () => void;
  setChatMessages: (messages: ChatMessages) => void;
  setConversationId: (conversationId: string) => void;
  setCurrentModel: (model: string) => void;
  setMessages: (messages: Message[]) => void;
};

export const useChatStore = create<ChatStore, any>(
  persist(
    (set) => ({
      chatMessages: {},
      conversationId: '',
      currentModel: DEFAULT_MODEL,
      messages: [],
      removeMessages: () => set({ messages: [] }),
      setChatMessages: (messages) => set({ chatMessages: messages }),
      setConversationId: (conversationId) => set({ conversationId }),
      setCurrentModel: (model) => set({ currentModel: model }),
      setMessages: (messages) => set({ messages }),
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        currentModel: state.currentModel,
      }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
