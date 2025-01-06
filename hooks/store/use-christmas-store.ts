import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ChristmasStore = {
  isEnabled: boolean;
  onEnable: (value: boolean) => void;
};

export const useChristmasStore = create<ChristmasStore, any>(
  persist(
    (set) => ({
      isEnabled: false,
      onEnable: (value) => set({ isEnabled: value }),
    }),
    {
      name: 'christmas-store',
      partialize: (state) => ({ isEnabled: state.isEnabled }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
