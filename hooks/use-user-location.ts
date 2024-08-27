import { useEffect } from 'react';

import {
  ALLOWED_CURRENCY,
  DEFAULT_CURRENCY,
  DEFAULT_EXCHANGE_RATE,
  DEFAULT_LOCALE,
} from '@/constants/locale';
import { fetcher } from '@/lib/fetcher';

import { ExchangeRates, useLocaleStore } from './use-locale-store';

export const useUserLocation = (exchangeRates: ExchangeRates) => {
  const { handleExchangeRates, handleLocaleInfo } = useLocaleStore((state) => ({
    handleExchangeRates: state.setExchangeRates,
    handleLocaleInfo: state.setLocaleInfo,
  }));

  useEffect(() => {
    const getUserLocation = async () => {
      const userIp = await fetcher.get('https://ipapi.co/json/', { responseType: 'json' });

      const currency = ALLOWED_CURRENCY.includes(userIp?.currency)
        ? userIp.currency
        : DEFAULT_CURRENCY;

      if (exchangeRates) {
        handleExchangeRates({
          ...exchangeRates,
          rates: Object.keys(exchangeRates.rates)
            .filter((key) => ALLOWED_CURRENCY.includes(key))
            .reduce((rates, key) => {
              rates[key as keyof typeof rates] = exchangeRates.rates[key] as never;
              return rates;
            }, {}),
        });
      }

      handleLocaleInfo({
        locale: { currency, locale: DEFAULT_LOCALE },
        details: {
          city: userIp.city,
          country: userIp.country_name,
          countryCode: userIp.country_code,
          latitude: userIp.latitude,
          longitude: userIp.longitude,
          timezone: userIp.timezone,
        },
        rate: exchangeRates?.rates?.[currency] ?? DEFAULT_EXCHANGE_RATE,
      });
    };

    getUserLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
