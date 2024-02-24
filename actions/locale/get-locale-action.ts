'use server';

import { DEFAULT_CURRENCY, DEFAULT_CURRENCY_EXCHANGE, DEFAULT_LOCALE } from '@/constants/locale';
import { fetcher } from '@/lib/fetcher';
import { fetchCachedData } from '@/lib/redis';

export const getLocale = async () => {
  try {
    const userIp = await fetcher.get('https://ipapi.co/json/', { responseType: 'json' });
    const exchangeRates = await fetchCachedData(
      'exchange-rate',
      async () => {
        const res = await fetcher.get('https://open.er-api.com/v6/latest/USD', {
          responseType: 'json',
        });

        return { updatedAt: res.time_last_update_unix, rates: res.rates };
      },
      60 * 60 * 12,
    );

    const currency = userIp?.currency ?? DEFAULT_CURRENCY;

    return {
      exchangeRates,
      localeInfo: {
        locale: { currency, locale: DEFAULT_LOCALE },
        details: {
          city: userIp.city,
          country: userIp.country_name,
          countryCode: userIp.country_code,
          latitude: userIp.latitude,
          longitude: userIp.longitude,
        },
        rate: exchangeRates?.rates?.[currency] ?? DEFAULT_CURRENCY_EXCHANGE,
      },
    };
  } catch (error) {
    console.error('[GET_LOCALE_ACTION]', error);

    return {
      exchangeRates: null,
      localeInfo: null,
    };
  }
};
