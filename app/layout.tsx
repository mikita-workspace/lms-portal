import './globals.css';

import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';

import { cn } from '@/lib/utils';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Nova LMS',
  description: 'LMS Portal for educational purposes',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=yes',
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-full bg-background font-sans antialiased', GeistSans.className)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
