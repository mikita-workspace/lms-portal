import { create } from 'zustand';

export type LocaleInfo = {
  locale: { currency: string; locale: string };
  details: {
    city: string;
    country: string;
    countryCode: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  rate: number;
} | null;

export type ExchangeRates = { updatedAt: number; rates: Record<string, number> } | null;

type LocaleStore = {
  exchangeRates: ExchangeRates;
  localeInfo: LocaleInfo;
  setExchangeRates: (rates: ExchangeRates) => void;
  setLocaleInfo: (info: LocaleInfo) => void;
};

export const useLocaleStore = create<LocaleStore>((set) => ({
  exchangeRates: null,
  localeInfo: null,
  setExchangeRates: (rates) => set({ exchangeRates: rates }),
  setLocaleInfo: (info) => set({ localeInfo: info }),
}));
