import { create } from 'zustand';

type UserSettingsStore = {
  isChristmasMode: boolean;
  isCopilotInNewTab: boolean;
  isPublicProfile: boolean;
  setIsChristmasMode: (value: boolean) => void;
  setIsCopilotInNewTab: (value: boolean) => void;
  setIsPublicProfile: (value: boolean) => void;
};

export const useUserSettingsStore = create<UserSettingsStore>((set) => ({
  isChristmasMode: false,
  isCopilotInNewTab: false,
  isPublicProfile: false,
  setIsChristmasMode: (value) => set({ isChristmasMode: value }),
  setIsCopilotInNewTab: (value) => set({ isCopilotInNewTab: value }),
  setIsPublicProfile: (value) => set({ isPublicProfile: value }),
}));
