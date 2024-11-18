'use client';

import { SessionProvider } from 'next-auth/react';
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import ReactConfetti from 'react-confetti';

import { GetAppConfig } from '@/actions/config/get-app-config';
import { Toaster as ToastProvider } from '@/components/ui/toaster';
import { useAppConfig } from '@/hooks/use-app-config';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import { ExchangeRates } from '@/hooks/use-locale-store';
import { useUserLocation } from '@/hooks/use-user-location';
import { switchLanguage } from '@/lib/locale';

const AuthProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <SessionProvider>{children}</SessionProvider>;
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

type ProvidersProps = Readonly<{
  appConfig: GetAppConfig;
  children: React.ReactNode;
  exchangeRates: ExchangeRates;
  locale: string;
  messages: AbstractIntlMessages;
  timeZone: string;
}>;

export const Providers = ({
  appConfig,
  children,
  exchangeRates,
  locale,
  messages,
  timeZone,
}: ProvidersProps) => {
  useAppConfig(appConfig);
  useUserLocation(exchangeRates);

  useEffect(() => {
    switchLanguage(locale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextIntlClientProvider messages={messages} locale={locale} timeZone={timeZone}>
        <AuthProvider>
          <ConfettiProvider />
          <ToastProvider />
          {children}
        </AuthProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
};
