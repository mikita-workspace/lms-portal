import { useEffect } from 'react';

import { GetAppConfig } from '@/actions/configs/get-app-config';

import { useAppConfigStore } from './store/use-app-config-store';

export const useAppConfig = (config: GetAppConfig) => {
  const { config: appConfig, setConfig } = useAppConfigStore((state) => ({
    config: state.config,
    setConfig: state.setConfig,
  }));

  useEffect(() => {
    const getAppConfig = () => {
      setConfig(config);
    };

    getAppConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { config: appConfig };
};
