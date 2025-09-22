'use server';

import Mail from 'nodemailer/lib/mailer';

import { OWNER_EMAIL } from '@/constants/common';
import { transporter } from '@/server/mailer';

type SentEmailTo = {
  attachments?: Mail.Attachment[];
  emails: string[];
  html?: string;
  subject: string;
  text?: string;
};

export const sentEmailTo = async ({ attachments, emails, html, subject, text }: SentEmailTo) => {
  try {
    const mail = await transporter.sendMail({
      attachments,
      from: `"${process.env.NODE_ENV === 'development' ? '[DEV] ' : ''}Nova Academy" <${OWNER_EMAIL}>`,
      html,
      subject,
      text,
      to: emails,
    });

    return { messageId: mail.messageId };
  } catch (error) {
    console.error('[SENT_MAIL_TO_ACTION]', error);

    return { messageId: null };
  }
};
