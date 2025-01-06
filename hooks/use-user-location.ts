import { useEffect } from 'react';

import {
  ALLOWED_CURRENCY,
  DEFAULT_COUNTRY_CODE,
  DEFAULT_CURRENCY,
  DEFAULT_EXCHANGE_RATE,
  DEFAULT_LOCALE,
  DEFAULT_TIMEZONE,
} from '@/constants/locale';
import { fetcher } from '@/lib/fetcher';

import { ExchangeRates, useLocaleStore } from './store/use-locale-store';

const defaultLocaleInfo = {
  locale: { currency: DEFAULT_CURRENCY, locale: DEFAULT_LOCALE },
  details: {
    city: 'Unknown',
    country: 'Unknown',
    countryCode: DEFAULT_COUNTRY_CODE,
    latitude: 0,
    longitude: 0,
    timezone: DEFAULT_TIMEZONE,
  },
  rate: DEFAULT_EXCHANGE_RATE,
};

export const useUserLocation = (exchangeRates: ExchangeRates) => {
  const { handleExchangeRates, handleLocaleInfo } = useLocaleStore((state) => ({
    handleExchangeRates: state.setExchangeRates,
    handleLocaleInfo: state.setLocaleInfo,
  }));

  useEffect(() => {
    const getUserLocation = async () => {
      try {
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
      } catch (error) {
        handleLocaleInfo(defaultLocaleInfo);
      }
    };

    if (process.env.NODE_ENV === 'development') {
      handleLocaleInfo(defaultLocaleInfo);
    } else {
      getUserLocation();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
