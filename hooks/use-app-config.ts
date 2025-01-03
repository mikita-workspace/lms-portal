import { useEffect } from 'react';

import { GetAppConfig } from '@/actions/configs/get-app-config';

import { useAppConfigStore } from './use-app-config-store';

export const useAppConfig = (config: GetAppConfig) => {
  const { setConfig } = useAppConfigStore((state) => ({ setConfig: state.setConfig }));

  useEffect(() => {
    const getAppConfig = () => {
      setConfig(config);
    };

    getAppConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
