'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { ThemeProvider, useTheme } from 'next-themes';

export const AuthProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
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

export const Providers = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
};
