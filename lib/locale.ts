import { setDefaultOptions } from 'date-fns';
import { be, enUS, ru } from 'date-fns/locale';

import { LOCALE } from '@/constants/locale';

export const getLocale = (locale?: string | null, restrictedLocales: string[] = []) => {
  if (!locale) {
    return LOCALE.EN;
  }

  const availableLocale = (Object.values(LOCALE) as string[]).includes(locale) ? locale : LOCALE.EN;

  return restrictedLocales.includes(availableLocale) ? LOCALE.EN : availableLocale;
};

export const switchLanguage = (language: string) => {
  switch (language) {
    case LOCALE.RU:
      setDefaultOptions({ locale: ru });
      break;
    case LOCALE.BE:
      setDefaultOptions({ locale: be });
      break;
    default:
      setDefaultOptions({ locale: enUS });
      break;
  }
};
