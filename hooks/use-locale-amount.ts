import { Fee } from '@prisma/client';
import { useMemo } from 'react';

import { DEFAULT_CURRENCY, DEFAULT_EXCHANGE_RATE, DEFAULT_LOCALE } from '@/constants/locale';
import { formatPrice, getConvertedPrice } from '@/lib/format';
import { isNumber } from '@/lib/guard';
import { hasJsonStructure } from '@/lib/utils';

import { useFeesAmount } from './use-fees-amount';
import { useLocaleStore } from './use-locale-store';

type UseLocaleAmount = {
  customRates?: string | null;
  fees?: Fee[];
  price: number | null;
  useDefaultLocale?: boolean;
};

export const useLocaleAmount = ({
  customRates,
  fees = [],
  price,
  useDefaultLocale = false,
}: UseLocaleAmount) => {
  const localeInfo = useLocaleStore((state) => state.localeInfo);

  const defaultLocale = { locale: DEFAULT_LOCALE, currency: DEFAULT_CURRENCY };

  const exchangeRate = useMemo(() => {
    if (useDefaultLocale) {
      return DEFAULT_EXCHANGE_RATE;
    }

    if (localeInfo?.locale.currency && hasJsonStructure(customRates ?? '')) {
      return JSON.parse(customRates!)[localeInfo.locale.currency];
    }
    return localeInfo?.rate ?? DEFAULT_EXCHANGE_RATE;
  }, [customRates, localeInfo?.locale.currency, localeInfo?.rate, useDefaultLocale]);

  const amount = (price ?? 0) * exchangeRate;

  const { net, calculatedFees } = useFeesAmount({ exchangeRate, fees, price: amount });

  const formattedPrice = localeInfo?.locale
    ? formatPrice(getConvertedPrice(amount), localeInfo.locale)
    : null;

  const formattedNet = localeInfo?.locale
    ? formatPrice(getConvertedPrice(net), localeInfo.locale)
    : null;

  const formattedCalculatedFees = calculatedFees.map((fee) => ({
    ...fee,
    amount: localeInfo?.locale
      ? formatPrice(getConvertedPrice(fee.amount), localeInfo.locale)
      : null,
  }));

  const formattedTotalFees = localeInfo?.locale
    ? formatPrice(
        getConvertedPrice(calculatedFees.reduce((total, fee) => total + fee.amount, 0)),
        localeInfo.locale,
      )
    : null;

  const isLoading = !isNumber(price) || !formattedPrice || !localeInfo;

  return {
    ...(useDefaultLocale
      ? {
          amount: price,
          formattedNet: formatPrice(getConvertedPrice(net), defaultLocale),
          formattedPrice: formatPrice(getConvertedPrice(price ?? 0), defaultLocale),
          formattedCalculatedFees: calculatedFees.map((fee) => ({
            ...fee,
            amount: formatPrice(getConvertedPrice(fee.amount), defaultLocale),
          })),
          formattedTotalFees: formatPrice(
            getConvertedPrice(calculatedFees.reduce((total, fee) => total + fee.amount, 0)),
            defaultLocale,
          ),
        }
      : { amount, formattedNet, formattedPrice, formattedCalculatedFees, formattedTotalFees }),
    isLoading,
  };
};
