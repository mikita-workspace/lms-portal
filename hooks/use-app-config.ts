import { useEffect } from 'react';

import { GetAppConfig } from '@/actions/config/get-app-config';

import { useAppConfigStore } from './use-app-config-store';

export const useAppConfig = (appConfig: GetAppConfig) => {
  const { handleAuthFlow } = useAppConfigStore((state) => ({ handleAuthFlow: state.setAuthFlow }));

  useEffect(() => {
    const getAppConfig = () => {
      handleAuthFlow(appConfig.authFlow);
    };

    getAppConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
