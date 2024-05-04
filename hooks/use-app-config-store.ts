import { create } from 'zustand';

type AppConfig = {
  authFlow: Record<string, boolean>;
  setAuthFlow: (flow: Record<string, boolean>) => void;
};

export const useAppConfigStore = create<AppConfig>((set) => ({
  authFlow: {},
  setAuthFlow: (flow) => set({ authFlow: flow }),
}));
