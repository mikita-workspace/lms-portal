'use server';

import { fetcher } from '@/lib/fetcher';

const docs = {
  'cookies-policy':
    'https://raw.githubusercontent.com/mikita-workspace/lms-portal/main/docs/cookies-policy.md',
  'privacy-policy':
    'https://raw.githubusercontent.com/mikita-workspace/lms-portal/main/docs/privacy-policy.md',
  terms: 'https://raw.githubusercontent.com/mikita-workspace/lms-portal/main/docs/terms.md',
};

export const getAppDocs = async (document: keyof typeof docs) => {
  try {
    const content = await fetcher.get(docs[document], { responseType: 'text' });

    return content;
  } catch (error) {
    console.error('[GET_APP_DOCS]', error);

    return '';
  }
};
