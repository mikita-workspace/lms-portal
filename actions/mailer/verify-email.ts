'use server';

import { User, UserSettings } from '@prisma/client';

import { getValueFromMemoryCache, removeValueFromMemoryCache } from '@/lib/cache';
import { db } from '@/lib/db';
import { decrypt } from '@/lib/utils';

type VerifyEmail = {
  user: (User & { settings: UserSettings | null }) | null;
  code?: string;
};

export const verifyEmail = async ({
  user,
  code,
}: VerifyEmail): Promise<{ label: string; variant: string }> => {
  if (!user || !user.id) {
    return { label: 'failed', variant: 'red' };
  }

  if (user.isEmailConfirmed) {
    return { label: 'success', variant: 'green' };
  }

  const cacheKey = `${user.id}-email_confirmation_token`;
  const cachedToken = await getValueFromMemoryCache(cacheKey);

  if (cachedToken && !code) {
    return { label: 'pending', variant: 'default' };
  }

  if (code) {
    try {
      const decrypted = JSON.parse(
        decrypt(decodeURIComponent(code), process.env.EMAIl_CONFIRMATION_SECRET as string),
      );

      if (!decrypted || decrypted.secret !== cachedToken) {
        return { label: 'failed', variant: 'red' };
      }

      await db.user.update({
        where: { id: user.id },
        data: { isEmailConfirmed: true },
      });

      await removeValueFromMemoryCache(cacheKey);

      return { label: 'success', variant: 'green' };
    } catch (error) {
      console.error('Error verifying email code:', error);

      return { label: 'failed', variant: 'red' };
    }
  }

  return { label: 'failed', variant: 'red' };
};

// export const verifyEmail = async ({ user, code }: VerifyEmail) => {
//   if (user?.isEmailConfirmed) {
//     return { label: 'success', variant: 'green' };
//   }

//   const key = `${user?.id}-email_confirmation_token`;
//   const cachedToken = await getValueFromMemoryCache(key);

//   if (cachedToken && !code) {
//     return { label: 'pending', variant: 'default' };
//   }

//   if (code) {
//     const decrypted = JSON.parse(
//       decrypt(decodeURIComponent(code), process.env.EMAIl_CONFIRMATION_SECRET as string),
//     );

//     if (decrypted?.secret !== cachedToken) {
//       return { label: 'pending', variant: 'default' };
//     }

//     await db.user.update({ where: { id: user?.id }, data: { isEmailConfirmed: true } });
//     await removeValueFromMemoryCache(key);

//     return { label: 'success', variant: 'green' };
//   }

//   return { label: 'failed', variant: 'red' };
// };
