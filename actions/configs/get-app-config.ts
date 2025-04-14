'use server';

import { promises as fs } from 'fs';

import { getGithubContents } from '../github/get-contents';

export type GetAppConfig = {
  ai: Record<string, string | Record<string, string>[]>;
  auth: Record<string, boolean>;
  features: Record<string, boolean>;
  providers: Record<string, boolean>;
};

export const getAppConfig = async (): Promise<GetAppConfig> => {
  try {
    const config =
      process.env.NODE_ENV === 'development'
        ? await fs.readFile(`${process.cwd()}/configs/app.json`, 'utf8')
        : await getGithubContents({ path: 'configs/app.json' });

    return JSON.parse(config);
  } catch (error) {
    console.error('[GET_APP_CONFIG_ACTION]', error);

    return {
      ai: {
        'image-models': [],
        'text-models': [],
        provider: 'ollama',
      },
      auth: {
        isBlockedNewLogin: true,
      },
      features: {
        christmas: false,
      },
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
