'use server';

import { db } from '@/lib/db';

type GetAppConfig = {
  id: string | null;
  authFlow: Record<string, boolean>;
};

export const getAppConfig = async (): Promise<GetAppConfig> => {
  try {
    const config = await db.configuration.findMany();

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
