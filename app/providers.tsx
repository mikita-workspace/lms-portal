'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import { Toaster } from 'react-hot-toast';

import { useConfettiStore } from '@/hooks/use-confetti-store';
import { ExchangeRates, LocaleInfo, useLocaleStore } from '@/hooks/use-locale-store';

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
  children,
  locale,
}: Readonly<{
  children: React.ReactNode;
  locale: {
    localeInfo: LocaleInfo;
    exchangeRates: ExchangeRates;
  };
}>) => {
  const { handleExchangeRates, handleLocaleInfo } = useLocaleStore((state) => ({
    handleExchangeRates: state.setExchangeRates,
    handleLocaleInfo: state.setLocaleInfo,
  }));

  useEffect(() => {
    handleExchangeRates(locale.exchangeRates);
    handleLocaleInfo(locale.localeInfo);
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
