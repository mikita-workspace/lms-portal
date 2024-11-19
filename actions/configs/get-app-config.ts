'use server';

import { promises as fs } from 'fs';

import { fetcher } from '@/lib/fetcher';

export type GetAppConfig = {
  providers: Record<string, boolean>;
};

export const getAppConfig = async (): Promise<GetAppConfig> => {
  try {
    const config =
      process.env.NODE_ENV === 'development'
        ? await fs.readFile(`${process.cwd()}/configs/app.json`, 'utf8')
        : await fetcher.get(
            'https://raw.githubusercontent.com/mikita-workspace/lms-portal/main/configs/app.json',
            { responseType: 'json' },
          );

    return JSON.parse(config);
  } catch (error) {
    console.error('[GET_APP_CONFIG_ACTION]', error);

    return {
      providers: {
        google: false,
        yandex: false,
        vk: false,
        mailru: false,
        linkedin: false,
        slack: false,
        github: true,
      },
    };
  }
};
