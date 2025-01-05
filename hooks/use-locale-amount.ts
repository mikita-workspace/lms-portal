import { Fee } from '@prisma/client';
import { useMemo } from 'react';

import { DEFAULT_CURRENCY, DEFAULT_EXCHANGE_RATE, DEFAULT_LOCALE } from '@/constants/locale';
import { formatPrice, getConvertedPrice } from '@/lib/format';
import { isNumber } from '@/lib/guard';
import { hasJsonStructure } from '@/lib/utils';

import { useLocaleStore } from './store/use-locale-store';
import { useFeesAmount } from './use-fees-amount';

type UseLocaleAmount = {
  currency?: string;
  customRates?: string | null;
  fees?: Fee[];
  ignoreExchangeRate?: boolean;
  price: number | null;
  useDefaultLocale?: boolean;
};

export const useLocaleAmount = ({
  currency,
  customRates,
  fees = [],
  ignoreExchangeRate = false,
  price,
  useDefaultLocale = false,
}: UseLocaleAmount) => {
  const localeInfo = useLocaleStore((state) => state.localeInfo);

  const defaultLocale = { locale: DEFAULT_LOCALE, currency: DEFAULT_CURRENCY };
  const locale = localeInfo?.locale
    ? { ...localeInfo.locale, currency: currency ?? localeInfo.locale.currency }
    : null;

  const exchangeRate = useMemo(() => {
    if (useDefaultLocale || ignoreExchangeRate) {
      return DEFAULT_EXCHANGE_RATE;
    }

    if (locale?.currency && hasJsonStructure(customRates ?? '')) {
      return JSON.parse(customRates!)[locale.currency];
    }
    return localeInfo?.rate ?? DEFAULT_EXCHANGE_RATE;
  }, [customRates, ignoreExchangeRate, locale?.currency, localeInfo?.rate, useDefaultLocale]);

  const amount = (price ?? 0) * exchangeRate;

  const { net, calculatedFees } = useFeesAmount({ exchangeRate, fees, price: amount });

  const formattedPrice = locale ? formatPrice(getConvertedPrice(amount), locale) : null;

  const formattedNet = locale ? formatPrice(getConvertedPrice(net), locale) : null;

  const formattedCalculatedFees = calculatedFees.map((fee) => ({
    ...fee,
    amount: locale ? formatPrice(getConvertedPrice(fee.amount), locale) : null,
  }));

  const formattedTotalFees = locale
    ? formatPrice(
        getConvertedPrice(calculatedFees.reduce((total, fee) => total + fee.amount, 0)),
        locale,
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
