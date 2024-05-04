'use server';

import { TEN_MINUTE_SEC } from '@/constants/common';
import { fetchCachedData } from '@/lib/cache';
import { db } from '@/lib/db';

export type GetAppConfig = {
  id: string | null;
  authFlow: Record<string, boolean>;
};

export const getAppConfig = async (noCache = false): Promise<GetAppConfig> => {
  try {
    const callback = async () => {
      const configuration = await db.configuration.findMany();

      return configuration;
    };

    const config = noCache
      ? await callback()
      : await fetchCachedData('app-config', callback, TEN_MINUTE_SEC);

    return {
      id: config[0].id,
      authFlow: JSON.parse(config[0].authFlowJson),
    };
  } catch (error) {
    console.error('[GET_APP_CONFIG_ACTION]', error);

    return {
      id: null,
      authFlow: {},
    };
  }
};
