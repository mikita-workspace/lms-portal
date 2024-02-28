import { Fee } from '@prisma/client';
import { useMemo } from 'react';

import { DEFAULT_CURRENCY, DEFAULT_CURRENCY_RATE, DEFAULT_LOCALE } from '@/constants/locale';
import { formatPrice, getConvertedPrice } from '@/lib/format';
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

  const rate = useMemo(() => {
    if (useDefaultLocale) {
      return DEFAULT_CURRENCY_RATE;
    }

    if (localeInfo?.locale.currency && hasJsonStructure(customRates ?? '')) {
      return JSON.parse(customRates!)[localeInfo.locale.currency];
    }
    return localeInfo?.rate ?? DEFAULT_CURRENCY_RATE;
  }, [customRates, localeInfo?.locale.currency, localeInfo?.rate, useDefaultLocale]);

  const amount = (price ?? 0) * rate;

  const { net, calculatedFees } = useFeesAmount({ fees, price: amount, rate });

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

  const isLoading = !Number.isFinite(price) || !formattedPrice || !localeInfo;

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
