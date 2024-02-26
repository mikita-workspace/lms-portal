export const formatPrice = (
  price: number,
  { locale, currency }: { locale: string; currency: string },
) =>
  new Intl.NumberFormat(locale, {
    currency,
    style: 'currency',
  }).format(price);

export const getCurrencySymbol = (locale: string, currency: string) =>
  (0)
    .toLocaleString(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/\d/g, '')
    .trim();

export const getConvertedPrice = (price: number) => price / 100;

export const getScaledPrice = (price: number) => price * 100;
