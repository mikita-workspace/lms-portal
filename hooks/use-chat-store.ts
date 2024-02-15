import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { create } from 'zustand';

import { DEFAULT_MODEL } from '@/constants/open-ai';

type ChatStore = {
  addMessages: (messages: ChatCompletionMessageParam[]) => void;
  currentModel: string;
  messages: ChatCompletionMessageParam[];
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
