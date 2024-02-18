import { useEffect, useState } from 'react';

import { CountryCode, Currency, Locale } from '@/constants/locale';
import { fetcher } from '@/lib/fetcher';

export const useCurrentLocale = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  const [ipInfo, setIpInfo] = useState<{ currency: Currency; locale: Locale } | null>(null);

  useEffect(() => {
    (async function () {
      try {
        setIsFetching(true);
        const response = await fetcher.get('https://ipapi.co/json/', { responseType: 'json' });

        await new Promise((resolve) => setTimeout(resolve, 10000));

        switch (response.country_code) {
          case CountryCode.BY:
            setIpInfo({ currency: Currency.BYN, locale: Locale.BE_BY });
            break;
          case CountryCode.DE:
            setIpInfo({ currency: Currency.EUR, locale: Locale.DE_DE });
            break;
          default:
            setIpInfo({ currency: Currency.USD, locale: Locale.EN_US });
            break;
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setIsFetching(false);
      }
    })();
  }, []);

  return { isFetching, ipInfo, error };
};
