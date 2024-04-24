import './globals.css';

import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

import { getExchangeRates } from '@/actions/exchange/get-exchange-rates';
import { CookieConsent } from '@/components/common/cookie-consent';
import { cn } from '@/lib/utils';

import { Providers } from './providers';

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
  width: 'device-width',
};

export const metadata: Metadata = {
  title: 'Nova LMS',
  description: 'LMS Portal for educational purposes',
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const yandexSans = localFont({
  src: [
    {
      path: '../public/fonts/YandexSansText-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/fonts/YandexSansText-Regular.woff2',
      weight: 'normal',
      style: 'normal',
    },
    {
      path: '../public/fonts/YandexSansText-RegularItalic.woff2',
      weight: 'normal',
      style: 'italic',
    },
    {
      path: '../public/fonts/YandexSansText-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/YandexSansText-Bold.woff2',
      weight: 'bold',
      style: 'normal',
    },
    {
      path: '../public/fonts/YandexSansText-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
});

const RootLayout = async ({ children }: RootLayoutProps) => {
  const { exchangeRates } = await getExchangeRates();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-full bg-background font-sans antialiased', yandexSans.className)}>
        <Providers exchangeRates={exchangeRates}>{children}</Providers>
        <CookieConsent />
      </body>
    </html>
  );
};

export default RootLayout;
