import { AuthFlow } from '@prisma/client';
import { create } from 'zustand';

type AppConfig = {
  authFlow: AuthFlow[];
  setAuthFlow: (flow: AuthFlow[]) => void;
};

export const useAppConfigStore = create<AppConfig>((set) => ({
  authFlow: [],
  setAuthFlow: (flow) => set({ authFlow: flow }),
}));
