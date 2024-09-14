import { LOCALE } from '@/constants/locale';

export const getLocale = (locale?: string | null) => {
  if (!locale) {
    return LOCALE.EN;
  }

  return (Object.values(LOCALE) as string[]).includes(locale) ? locale : LOCALE.EN;
};
