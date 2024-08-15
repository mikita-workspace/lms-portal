'use server';

import { AuthFlow } from '@prisma/client';

import { TEN_MINUTE_SEC } from '@/constants/common';
import { fetchCachedData } from '@/lib/cache';
import { db } from '@/lib/db';

export type GetAppConfig = {
  authFlow: AuthFlow[];
};

export const getAppConfig = async (noCache = false): Promise<GetAppConfig> => {
  try {
    const callback = async () => {
      const authFlow = await db.authFlow.findMany();

      return { authFlow };
    };

    const config = noCache
      ? await callback()
      : await fetchCachedData('app-config', callback, TEN_MINUTE_SEC);

    return config;
  } catch (error) {
    console.error('[GET_APP_CONFIG_ACTION]', error);

    return {
      authFlow: [],
    };
  }
};
