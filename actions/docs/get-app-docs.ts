'use server';

import { promises as fs } from 'fs';

import { fetcher } from '@/lib/fetcher';

const docs = {
  'cookies-policy': process.env.COOKIES_POLICY,
  'privacy-policy': process.env.PRIVACY_POLICY,
  terms: process.env.TERMS,
};

export const getAppDocs = async (document: keyof typeof docs) => {
  try {
    const content =
      process.env.NODE_ENV === 'development'
        ? await fs.readFile(`${process.cwd()}/docs/${document}.md`, 'utf8')
        : await fetcher.get(docs[document] as string, { responseType: 'text' });

    return content;
  } catch (error) {
    console.error('[GET_APP_DOCS_ACTION]', error);

    return '';
  }
};
