import { LOCALE } from '@/constants/locale';

export const getLocale = (locale?: string | null, restrictedLocales: string[] = []) => {
  if (!locale) {
    return LOCALE.EN;
  }

  const availableLocale = (Object.values(LOCALE) as string[]).includes(locale) ? locale : LOCALE.EN;

  return restrictedLocales.includes(availableLocale) ? LOCALE.EN : availableLocale;
};
