import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Conversation } from '@/actions/chat/get-chat-conversations';
import { DEFAULT_MODEL } from '@/constants/open-ai';

type ChatMessages = Record<string, Conversation['messages']>;

type ChatStore = {
  chatMessages: ChatMessages;
  conversationId: string;
  currentModel: string;
  isFetching: boolean;
  setChatMessages: (messages: ChatMessages) => void;
  setConversationId: (conversationId: string) => void;
  setCurrentModel: (model: string) => void;
  setIsFetching: (value: boolean) => void;
};

export const useChatStore = create<ChatStore, any>(
  persist(
    (set) => ({
      chatMessages: {},
      conversationId: '',
      currentModel: DEFAULT_MODEL,
      isFetching: false,
      setChatMessages: (messages) => set({ chatMessages: messages }),
      setConversationId: (conversationId) => set({ conversationId }),
      setCurrentModel: (model) => set({ currentModel: model }),
      setIsFetching: (value) => set({ isFetching: value }),
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        conversationId: state.conversationId,
        currentModel: state.currentModel,
      }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
