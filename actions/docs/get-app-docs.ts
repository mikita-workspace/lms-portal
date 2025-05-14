'use server';

import { promises as fs } from 'fs';
import { getLocale } from 'next-intl/server';

import { getGithubContents } from '../github/get-contents';

export const getAppDocs = async (document: string) => {
  const locale = await getLocale();

  try {
    const content =
      process.env.NODE_ENV === 'development'
        ? await fs.readFile(`${process.cwd()}/docs/${locale}/${document}.md`, 'utf8')
        : await getGithubContents({ path: `docs/${locale}/${document}.md` });

    return content;
  } catch (error) {
    console.error('[GET_APP_DOCS_ACTION]', error);

    return '';
  }
};
