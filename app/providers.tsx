'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

const AuthProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <SessionProvider>{children}</SessionProvider>;
};

const ToastProvider = () => {
  return <Toaster toastOptions={{ className: 'dark:bg-neutral-900 dark:text-primary' }} />;
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
