'use server';

import { getTranslations } from 'next-intl/server';

import { db } from '@/lib/db';

export const getIsEmailConfirmed = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { isEmailConfirmed: true },
  });

  if (user?.isEmailConfirmed) {
    return { success: true };
  }

  const t = await getTranslations('email-notification.confirmation');

  return {
    success: false,
    message: t('warning'),
  };
};
