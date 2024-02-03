'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { ThemeProvider, useTheme } from 'next-themes';
import { Toaster } from 'react-hot-toast';

const AuthProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: resolvedTheme === 'dark' ? dark : undefined,
        layout: {
          termsPageUrl: 'https://clerk.com/terms',
          privacyPageUrl: 'https://clerk.com/terms',
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
};

const ToastProvider = () => {
  return <Toaster />;
};

export const Providers = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <ToastProvider />
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
};
