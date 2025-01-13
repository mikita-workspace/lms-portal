'use client';

import { SessionProvider } from 'next-auth/react';
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import Snowfall from 'react-snowfall';

import { GetAppConfig } from '@/actions/configs/get-app-config';
import { Toaster as ToastProvider } from '@/components/ui/toaster';
import { useChristmasStore } from '@/hooks/store/use-christmas-store';
import { useConfettiStore } from '@/hooks/store/use-confetti-store';
import { ExchangeRates } from '@/hooks/store/use-locale-store';
import { useAppConfig } from '@/hooks/use-app-config';
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

const ChristmasProvider = () => {
  const isEnabled = useChristmasStore((state) => state.isEnabled);

  if (!isEnabled) {
    return null;
  }

  return (
    <Snowfall
      radius={[0.5, 2]}
      snowflakeCount={250}
      style={{
        height: '100vh',
        pointerEvents: 'none',
        position: 'fixed',
        width: '100vw',
        zIndex: 100,
      }}
      wind={[0, 1]}
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
  const { config } = useAppConfig(appConfig);

  useUserLocation(exchangeRates);

  useEffect(() => {
    switchLanguage(locale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextIntlClientProvider messages={messages} locale={locale} timeZone={timeZone}>
        <AuthProvider>
          {config?.features?.christmas && <ChristmasProvider />}
          <ConfettiProvider />
          <ToastProvider />
          {children}
        </AuthProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
};
