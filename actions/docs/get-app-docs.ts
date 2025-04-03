'use server';

import { promises as fs } from 'fs';

import { getGithubContents } from '../github/get-contents';

export const getAppDocs = async (document: string) => {
  try {
    const content =
      process.env.NODE_ENV === 'development'
        ? await fs.readFile(`${process.cwd()}/docs/${document}.md`, 'utf8')
        : await getGithubContents({ path: `docs/${document}.md` });

    return content;
  } catch (error) {
    console.error('[GET_APP_DOCS_ACTION]', error);

    return '';
  }
};
