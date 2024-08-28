'use server';

import { cookies } from 'next/headers';

import { ONE_YEAR_SEC } from '@/constants/common';
import { USER_LOCALE_COOKIE } from '@/constants/locale';

export const changeLocale = async (lang: string) => {
  cookies().set(USER_LOCALE_COOKIE, lang, {
    httpOnly: true,
    maxAge: ONE_YEAR_SEC,
  });
};
