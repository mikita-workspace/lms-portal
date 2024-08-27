import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

import { DEFAULT_LANGUAGE, USER_LOCALE_COOKIE } from './constants/locale';

export default getRequestConfig(async () => {
  const locale = cookies().get(USER_LOCALE_COOKIE)?.value || DEFAULT_LANGUAGE;

  return {
    locale,
    messages: (await import(`/messages/${locale}.json`)).default,
    timeZone: 'UTC',
  };
});
