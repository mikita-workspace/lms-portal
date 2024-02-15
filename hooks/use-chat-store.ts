import { create } from 'zustand';

import { DEFAULT_MODEL } from '@/constants/open-ai';

type ChatStore = {
  addMessages: (messages: { role: string; content: string }[]) => void;
  currentModel: string;
  messages: { role: string; content: string }[];
  removeMessages: () => void;
  setCurrentModel: (model: string) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  addMessages: (messages) => set((state) => ({ messages: [...state.messages, ...messages] })),
  currentModel: DEFAULT_MODEL,
  messages: [],
  removeMessages: () => set({ messages: [] }),
  setCurrentModel: (model) => set({ currentModel: model }),
}));
