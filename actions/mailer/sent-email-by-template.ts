'use server';

import { getEmailTemplate } from './get-email-template';
import { sentEmailTo } from './sent-email-to';

type SentEmailByTemplate = {
  emails: string[];
  params: Record<string, string>;
  subject: string;
  template: string;
};

export const sentEmailByTemplate = async ({
  emails,
  params,
  subject,
  template,
}: SentEmailByTemplate) => {
  try {
    const htmlTemplate = await getEmailTemplate(template);
    let html = htmlTemplate;

    for (const [key, value] of Object.entries(params)) {
      const regexp = `{{${key}}}`;
      html = html.replace(new RegExp(regexp, 'g'), value);
    }

    html = html.replace('{{year}}', new Date().getFullYear().toString());

    const emailMessage = await sentEmailTo({
      emails,
      subject,
      html,
    });
    return { messageId: emailMessage.messageId };
  } catch (error) {
    console.error('[SENT_MAIL_BY_TEMPLATE_ACTION]', error);

    return { messageId: null };
  }
};
