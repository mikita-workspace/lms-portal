import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { create } from 'zustand';

type ChatStore = {
  addMessages: (messages: ChatCompletionMessageParam[]) => void;
  messages: ChatCompletionMessageParam[];
  removeMessages: () => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  addMessages: (messages) => set((state) => ({ messages: [...state.messages, ...messages] })),
  messages: [],
  removeMessages: () => set({ messages: [] }),
}));
