import { create } from 'zustand';

import { GetAppConfig } from '@/actions/configs/get-app-config';

type AppConfig = {
  config: GetAppConfig | null;
  setConfig: (config: GetAppConfig) => void;
};

export const useAppConfigStore = create<AppConfig>((set) => ({
  config: null,
  setConfig: (config) => set({ config }),
}));
