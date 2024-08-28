import { setDefaultOptions } from 'date-fns';
import { be, enUS, ru } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { LOCALE } from '@/constants/locale';

export const useSetDateLocale = (locale: string) => {
  const router = useRouter();

  useEffect(() => {
    switch (locale) {
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

    router.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);
};
