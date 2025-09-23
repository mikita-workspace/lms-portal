'use server';

import Mail from 'nodemailer/lib/mailer';

import { getEmailTemplate } from './get-email-template';
import { sentEmailTo } from './sent-email-to';

type SentEmailByTemplate = {
  attachments?: Mail.Attachment[];
  emails: string[];
  locale?: string;
  params: Record<string, string>;
  subject: string;
  template: string;
};

export const sentEmailByTemplate = async ({
  attachments,
  emails,
  locale,
  params,
  subject,
  template,
}: SentEmailByTemplate) => {
  try {
    const htmlTemplate = await getEmailTemplate(template, locale);
    let html = htmlTemplate;

    for (const [key, value] of Object.entries(params)) {
      const regexp = `{{${key}}}`;
      html = html.replace(new RegExp(regexp, 'g'), value);
    }

    html = html.replace('{{year}}', new Date().getFullYear().toString());

    const emailMessage = await sentEmailTo({
      attachments,
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
