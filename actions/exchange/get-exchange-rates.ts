'use server';

import { ONE_DAY_SEC } from '@/constants/common';
import { DEFAULT_CURRENCY } from '@/constants/locale';
import { fetchCachedData } from '@/lib/cache';
import { fetcher } from '@/lib/fetcher';

export const getExchangeRates = async () => {
  try {
    const exchangeRates = await fetchCachedData(
      'exchange-rate',
      async () => {
        const res = await fetcher.get(`https://open.er-api.com/v6/latest/${DEFAULT_CURRENCY}`, {
          responseType: 'json',
        });

        return { updatedAt: res.time_last_update_unix, rates: res.rates };
      },
      ONE_DAY_SEC / 2,
    );

    return {
      exchangeRates,
    };
  } catch (error) {
    console.error('[GET_LOCALE_ACTION]', error);

    return {
      exchangeRates: null,
    };
  }
};
