'use server';

import { promises as fs } from 'fs';
import { getLocale } from 'next-intl/server';

import { getGithubContents } from '../github/get-contents';

export const getEmailTemplate = async (template: string) => {
  const locale = await getLocale();

  try {
    const content =
      process.env.NODE_ENV === 'development'
        ? await fs.readFile(`${process.cwd()}/email-templates/${locale}/${template}.html`, 'utf8')
        : await getGithubContents({ path: `email-templates/${locale}/${template}.html` });

    return content;
  } catch (error) {
    console.error('[GET_EMAIL_TEMPLATE_ACTION]', error);

    return '';
  }
};
