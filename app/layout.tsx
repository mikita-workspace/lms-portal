import './globals.css';

import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';

import { getExchangeRates } from '@/actions/exchange/get-exchange-rates';
import { CookieConsent } from '@/components/common/cookie-consent';
import { cn } from '@/lib/utils';

import { Providers } from './providers';

export const runtime = 'edge';

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

const RootLayout = async ({ children }: RootLayoutProps) => {
  const { exchangeRates } = await getExchangeRates();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-full bg-background font-sans antialiased', GeistSans.className)}>
        <Providers exchangeRates={exchangeRates}>{children}</Providers>
        <CookieConsent />
      </body>
    </html>
  );
};

export default RootLayout;
