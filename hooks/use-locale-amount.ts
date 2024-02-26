import { useMemo } from 'react';

import { DEFAULT_CURRENCY_EXCHANGE } from '@/constants/locale';
import { formatPrice, getConvertedPrice } from '@/lib/format';
import { hasJsonStructure } from '@/lib/utils';

import { useLocaleStore } from './use-locale-store';

export const useLocaleAmount = (price: number | null, customRates: string | null) => {
  const localeInfo = useLocaleStore((state) => state.localeInfo);

  const amount = useMemo(() => {
    if (localeInfo?.locale.currency && price) {
      if (hasJsonStructure(customRates ?? '')) {
        return price * JSON.parse(customRates!)[localeInfo.locale.currency];
      }

      return price * (localeInfo?.rate ?? DEFAULT_CURRENCY_EXCHANGE);
    }

    return 0;
  }, [customRates, localeInfo?.locale.currency, localeInfo?.rate, price]);

  const formattedPrice = localeInfo?.locale
    ? formatPrice(getConvertedPrice(amount), localeInfo?.locale)
    : null;

  const isLoading = !Number.isFinite(price) || !formattedPrice || !localeInfo;

  return { amount, formattedPrice, isLoading };
};
