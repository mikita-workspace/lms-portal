'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import { Toaster } from 'react-hot-toast';

import { GetAppConfig } from '@/actions/config/get-app-config';
import {
  ALLOWED_CURRENCY,
  DEFAULT_CURRENCY,
  DEFAULT_EXCHANGE_RATE,
  DEFAULT_LOCALE,
} from '@/constants/locale';
import { useAppConfigStore } from '@/hooks/use-app-config-store';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import { ExchangeRates, useLocaleStore } from '@/hooks/use-locale-store';
import { fetcher } from '@/lib/fetcher';

const AuthProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <SessionProvider>{children}</SessionProvider>;
};

const ToastProvider = () => {
  return <Toaster toastOptions={{ className: 'dark:bg-neutral-900 dark:text-primary' }} />;
};

const ConfettiProvider = () => {
  const { isOpen, onClose } = useConfettiStore((state) => ({
    isOpen: state.isOpen,
    onClose: state.onClose,
  }));

  if (!isOpen) {
    return null;
  }

  return (
    <ReactConfetti
      className="pointer-events-none z-[100]"
      numberOfPieces={500}
      recycle={false}
      onConfettiComplete={() => onClose()}
    />
  );
};

export const Providers = ({
  appConfig,
  children,
  exchangeRates,
}: Readonly<{
  appConfig: GetAppConfig;
  children: React.ReactNode;
  exchangeRates: ExchangeRates;
}>) => {
  const { handleExchangeRates, handleLocaleInfo } = useLocaleStore((state) => ({
    handleExchangeRates: state.setExchangeRates,
    handleLocaleInfo: state.setLocaleInfo,
  }));

  const { handleAuthFlow } = useAppConfigStore((state) => ({ handleAuthFlow: state.setAuthFlow }));

  useEffect(() => {
    const getUserLocation = async () => {
      const userIp = await fetcher.get('https://ipapi.co/json/', { responseType: 'json' });

      const currency = ALLOWED_CURRENCY.includes(userIp?.currency)
        ? userIp.currency
        : DEFAULT_CURRENCY;

      if (exchangeRates) {
        handleExchangeRates({
          ...exchangeRates,
          rates: Object.keys(exchangeRates.rates)
            .filter((key) => ALLOWED_CURRENCY.includes(key))
            .reduce((rates, key) => {
              rates[key as keyof typeof rates] = exchangeRates.rates[key] as never;
              return rates;
            }, {}),
        });
      }

      handleLocaleInfo({
        locale: { currency, locale: DEFAULT_LOCALE },
        details: {
          city: userIp.city,
          country: userIp.country_name,
          countryCode: userIp.country_code,
          latitude: userIp.latitude,
          longitude: userIp.longitude,
          timezone: userIp.timezone,
        },
        rate: exchangeRates?.rates?.[currency] ?? DEFAULT_EXCHANGE_RATE,
      });
    };

    const getAppConfig = () => {
      handleAuthFlow(appConfig.authFlow);
    };

    getUserLocation();
    getAppConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <ConfettiProvider />
        <ToastProvider />
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
};
