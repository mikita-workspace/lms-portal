import { Currency, Locale } from '@/constants/locale';

export const formatPrice = (
  price: number,
  { locale, currency }: { locale: Locale; currency: Currency },
) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(price);

export const getCurrencySymbol = (locale: Locale, currency: Currency) =>
  (0)
    .toLocaleString(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/\d/g, '')
    .trim();
