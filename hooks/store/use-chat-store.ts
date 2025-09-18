import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Conversation } from '@/actions/chat/get-chat-conversations';

type ChatMessages = Record<string, Conversation['messages']>;

type ChatStore = {
  chatMessages: ChatMessages;
  conversationId: string;
  currentModel: string;
  currentModelLabel: string;
  hasSearch: boolean;
  isFetching: boolean;
  isImageGeneration?: boolean;
  isSearchMode: boolean;
  setChatMessages: (messages: ChatMessages) => void;
  setConversationId: (conversationId: string) => void;
  setCurrentModel: (model: string) => void;
  setCurrentModelLabel: (label: string) => void;
  setHasSearch: (value: boolean) => void;
  setIsFetching: (value: boolean) => void;
  setIsImageGeneration: (value: boolean) => void;
  setIsSearchMode: (value: boolean) => void;
};

export const useChatStore = create<ChatStore, any>(
  persist(
    (set) => ({
      chatMessages: {},
      conversationId: '',
      currentModel: '',
      currentModelLabel: '',
      hasSearch: false,
      isFetching: false,
      isImageGeneration: false,
      isSearchMode: false,
      setChatMessages: (messages) => set({ chatMessages: messages }),
      setConversationId: (conversationId) => set({ conversationId }),
      setCurrentModel: (model) => set({ currentModel: model }),
      setCurrentModelLabel: (label) => set({ currentModelLabel: label }),
      setHasSearch: (value) => set({ hasSearch: value }),
      setIsFetching: (value) => set({ isFetching: value }),
      setIsImageGeneration: (value) => set({ isImageGeneration: value }),
      setIsSearchMode: (value) => set({ isSearchMode: value }),
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        currentModel: state.currentModel,
        currentModelLabel: state.currentModelLabel,
        hasSearch: state.hasSearch,
      }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
