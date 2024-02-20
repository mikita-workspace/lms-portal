import { useEffect, useState } from 'react';

import { Currency, Locale } from '@/constants/locale';
import { fetcher } from '@/lib/fetcher';

export const useCurrentLocale = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  const [ipInfo, setIpInfo] = useState<{
    locale: { currency: Currency; locale: Locale };
    details: {
      city: string;
      country: string;
      countryCode: string;
      latitude: number;
      longitude: number;
    };
  } | null>(null);

  useEffect(() => {
    const fetchIpInfo = async () => {
      try {
        setIsFetching(true);
        const response = await fetcher.get('https://ipapi.co/json/', { responseType: 'json' });

        const details = {
          city: response.city,
          country: response.country_name,
          countryCode: response.country_code,
          latitude: response.latitude,
          longitude: response.longitude,
        };

        switch (response.currency) {
          case Currency.BYN:
            setIpInfo({ locale: { currency: Currency.BYN, locale: Locale.EN_US }, details });
            break;
          case Currency.EUR:
            setIpInfo({ locale: { currency: Currency.EUR, locale: Locale.DE_DE }, details });
            break;
          default:
            setIpInfo({ locale: { currency: Currency.USD, locale: Locale.EN_US }, details });
            break;
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchIpInfo();
  }, []);

  return { isFetching, ipInfo, error };
};
