export enum Currency {
  BYN = 'BYN',
  EUR = 'EUR',
  USD = 'USD',
}

export enum Locale {
  BE_BY = 'be-BY',
  DE_DE = 'de-DE',
  EN_US = 'en-US',
}

export enum CountryCode {
  BY = 'BY',
  DE = 'DE',
  US = 'US',
}

export const locales = [
  { locale: Locale.BE_BY, currency: Currency.BYN },
  { locale: Locale.DE_DE, currency: Currency.EUR },
  { locale: Locale.EN_US, currency: Currency.USD },
];
