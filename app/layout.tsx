import './globals.css';

import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';

import { getLocale } from '@/actions/locale/get-locale-action';
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

const RootLayout = async ({ children }: RootLayoutProps) => {
  const locale = await getLocale();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-full bg-background font-sans antialiased', GeistSans.className)}>
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
