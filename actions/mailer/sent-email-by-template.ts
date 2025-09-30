'use server';

import Handlebars from 'handlebars';
import { getLocale } from 'next-intl/server';
import Mail from 'nodemailer/lib/mailer';

import { EMAIL_NOTIFICATION_MESSAGES } from '@/constants/email-notifications';

import { getEmailTemplate } from './get-email-template';
import { sentEmailTo } from './sent-email-to';

type SentEmailByTemplate = {
  attachments?: Mail.Attachment[];
  emails: string[];
  locale?: string;
  params: Record<string, string>;
  subject?: string;
  template: keyof (typeof EMAIL_NOTIFICATION_MESSAGES)[keyof typeof EMAIL_NOTIFICATION_MESSAGES];
};

export const sentEmailByTemplate = async ({
  attachments,
  emails,
  locale: customLocale,
  params,
  subject: customSubject,
  template,
}: SentEmailByTemplate) => {
  try {
    const locale = customLocale ?? (await getLocale());

    const localeTemplates =
      EMAIL_NOTIFICATION_MESSAGES[locale as keyof typeof EMAIL_NOTIFICATION_MESSAGES];
    const translations = localeTemplates[template];

    const templateContent = await getEmailTemplate(template);
    const templateHtml = Handlebars.compile(templateContent);

    let subject = translations?.subject;

    for (const [key, value] of Object.entries(params)) {
      const regexp = `{{${key}}}`;
      subject = subject.replace(new RegExp(regexp, 'g'), value);
    }

    const templateData = {
      ...translations,
      ...params,
      lang: locale,
      title: template,
      year: new Date().getFullYear().toString(),
    };

    const html = templateHtml(templateData);

    const emailMessage = await sentEmailTo({
      attachments,
      emails,
      subject: customSubject ?? subject,
      html,
    });
    return { messageId: emailMessage.messageId };
  } catch (error) {
    console.error('[SENT_MAIL_BY_TEMPLATE_ACTION]', error);

    return { messageId: null };
  }
};
