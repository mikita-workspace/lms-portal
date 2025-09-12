'use server';

import { OWNER_EMAIL } from '@/constants/common';
import { transporter } from '@/server/mailer';

type SentEmailTo = { emails: string[]; subject: string; html: string };

export const sentEmailTo = async ({ emails, subject, html }: SentEmailTo) => {
  try {
    const mail = await transporter.sendMail({
      from: `"${process.env.NODE_ENV === 'development' ? '[DEV] ' : ''}Nova Academy" <${OWNER_EMAIL}>`,
      html,
      subject: subject,
      to: emails,
    });

    return { messageId: mail.messageId };
  } catch (error) {
    console.error('[SENT_MAIL_TO_ACTION]', error);

    return { messageId: null };
  }
};
