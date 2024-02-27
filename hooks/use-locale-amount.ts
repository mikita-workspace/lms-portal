import { Fee } from '@prisma/client';
import { useMemo } from 'react';

import { DEFAULT_CURRENCY, DEFAULT_CURRENCY_EXCHANGE, DEFAULT_LOCALE } from '@/constants/locale';
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

  const amount = useMemo(() => {
    if (localeInfo?.locale.currency && price) {
      if (hasJsonStructure(customRates ?? '')) {
        return price * JSON.parse(customRates!)[localeInfo.locale.currency];
      }

      return price * (localeInfo?.rate ?? DEFAULT_CURRENCY_EXCHANGE);
    }

    return 0;
  }, [customRates, localeInfo?.locale.currency, localeInfo?.rate, price]);

  const { net, calculatedFees } = useFeesAmount(useDefaultLocale ? price : amount, fees);

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
          formattedNet: formatPrice(getConvertedPrice(net), {
            locale: DEFAULT_LOCALE,
            currency: DEFAULT_CURRENCY,
          }),
          formattedPrice: formatPrice(getConvertedPrice(price ?? 0), {
            locale: DEFAULT_LOCALE,
            currency: DEFAULT_CURRENCY,
          }),
          formattedCalculatedFees: calculatedFees.map((fee) => ({
            ...fee,
            amount: formatPrice(getConvertedPrice(fee.amount), {
              locale: DEFAULT_LOCALE,
              currency: DEFAULT_CURRENCY,
            }),
          })),
          formattedTotalFees: formatPrice(
            getConvertedPrice(calculatedFees.reduce((total, fee) => total + fee.amount, 0)),
            {
              locale: DEFAULT_LOCALE,
              currency: DEFAULT_CURRENCY,
            },
          ),
        }
      : { amount, formattedNet, formattedPrice, formattedCalculatedFees, formattedTotalFees }),
    isLoading,
  };
};
