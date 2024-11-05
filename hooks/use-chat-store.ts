import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_MODEL } from '@/constants/open-ai';

type Message = { role: string; content: string; timestamp: number };

type ChatStore = {
  currentConversationId: string | null;
  currentModel: string;
  messages: Message[];
  removeMessages: () => void;
  setCurrentConversationId: (conversationId: string | null) => void;
  setCurrentModel: (model: string) => void;
  setMessages: (messages: Message[]) => void;
};

export const useChatStore = create<ChatStore, any>(
  persist(
    (set) => ({
      currentConversationId: null,
      currentModel: DEFAULT_MODEL,
      messages: [],
      removeMessages: () => set({ messages: [] }),
      setCurrentConversationId: (conversationId) => set({ currentConversationId: conversationId }),
      setCurrentModel: (model) => set({ currentModel: model }),
      setMessages: (messages) => set({ messages }),
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({ currentModel: state.currentModel, messages: state.messages }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
