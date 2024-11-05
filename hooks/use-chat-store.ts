import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_MODEL } from '@/constants/open-ai';

type Message = { role: string; content: string; timestamp: number };

type ChatStore = {
  currentModel: string;
  messages: Message[];
  removeMessages: () => void;
  setCurrentModel: (model: string) => void;
  setMessages: (messages: Message[]) => void;
};

export const useChatStore = create<ChatStore, any>(
  persist(
    (set) => ({
      currentModel: DEFAULT_MODEL,
      messages: [],
      removeMessages: () => set({ messages: [] }),
      setCurrentModel: (model) => set({ currentModel: model }),
      setMessages: (messages) => set({ messages }),
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        currentModel: state.currentModel,
        messages: state.messages,
      }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
