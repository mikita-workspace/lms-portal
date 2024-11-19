import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { Noto_Sans } from 'next/font/google';
import { getLocale, getMessages, getTimeZone } from 'next-intl/server';

import { getAppConfig } from '@/actions/configs/get-app-config';
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
  title: 'Nova Academy',
  description: 'Educational portal',
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_DOMAIN },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const notoSans = Noto_Sans({ subsets: ['latin'] });

const RootLayout = async ({ children }: RootLayoutProps) => {
  const { exchangeRates } = await getExchangeRates();
  const appConfig = await getAppConfig();
  const locale = await getLocale();
  const messages = await getMessages();
  const timeZone = await getTimeZone();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn('min-h-full bg-background font-sans antialiased', notoSans.className)}>
        <Providers
          appConfig={appConfig}
          exchangeRates={exchangeRates}
          locale={locale}
          messages={messages}
          timeZone={timeZone}
        >
          {children}
          <CookieConsent />
        </Providers>
        {/* Vercel Cloud Tools */}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;
