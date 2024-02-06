import { Currency, Locale } from '@/constants/locale';

export const formatPrice = (
  price: number,
  { locale, currency }: { locale: Locale; currency: Currency },
) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(price);
