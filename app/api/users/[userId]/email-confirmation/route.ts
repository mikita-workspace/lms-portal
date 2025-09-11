import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';
import { v4 as uuidv4 } from 'uuid';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getEmailTemplate } from '@/actions/mailer/get-email-template';
import { sentMailTo } from '@/actions/mailer/sent-mail-to';
import { ONE_HOUR_SEC } from '@/constants/common';
import { setValueToMemoryCache } from '@/lib/cache';
import { absoluteUrl, encrypt } from '@/lib/utils';

export const POST = async (_: NextRequest, props: { params: Promise<{ userId: string }> }) => {
  const { userId } = await props.params;

  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse(ReasonPhrases.UNAUTHORIZED, { status: StatusCodes.UNAUTHORIZED });
    }

    const t = await getTranslations('email-notification.confirmation');
    const htmlTemplate = await getEmailTemplate('confirmation-email');

    const secret = uuidv4();
    const key = `${userId}-email_confirmation_token`;
    await setValueToMemoryCache(key, secret, ONE_HOUR_SEC);

    const verificationLink = absoluteUrl(
      `/settings/general?code=${encodeURIComponent(encrypt({ secret, key }, process.env.EMAIl_CONFIRMATION_SECRET as string))}`,
    );

    const html = htmlTemplate
      .replace('{{username}}', user?.name ?? '')
      .replace('{{verificationLink}}', verificationLink)
      .replace('{{year}}', new Date().getFullYear().toString());

    const mailMessage = await sentMailTo({
      emails: [user?.email ?? ''],
      subject: t('subject'),
      html,
    });

    return NextResponse.json({ messageId: mailMessage.messageId });
  } catch (error) {
    console.error('[POST_EMAIL_CONFIRMATION]', error);

    return new NextResponse(ReasonPhrases.INTERNAL_SERVER_ERROR, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};
