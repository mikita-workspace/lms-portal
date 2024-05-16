import './globals.css';

import type { Metadata, Viewport } from 'next';
import { Noto_Sans } from 'next/font/google';

import { getAppConfig } from '@/actions/config/get-app-config';
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
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_DOMAIN },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const notoSans = Noto_Sans({ subsets: ['latin'] });

const RootLayout = async ({ children }: RootLayoutProps) => {
  const { exchangeRates } = await getExchangeRates();
  const appConfig = await getAppConfig();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-full bg-background font-sans antialiased', notoSans.className)}>
        <Providers appConfig={appConfig} exchangeRates={exchangeRates}>
          {children}
        </Providers>
        <CookieConsent />
      </body>
    </html>
  );
};

export default RootLayout;
