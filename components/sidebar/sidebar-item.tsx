'use client';

import { LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { useCurrentUser } from '@/hooks/use-current-user';
import { cn } from '@/lib/utils';

import { AuthRedirect } from '../auth/auth-redirect';

type SideBarItemProps = {
  href: string;
  icon?: LucideIcon;
  isProtected?: boolean;
  label: string;
};

export const SideBarItem = ({ href, icon: Icon, isProtected, label }: SideBarItemProps) => {
  const t = useTranslations('sidebar');

  const { user } = useCurrentUser();

  const pathname = usePathname();
  const router = useRouter();

  const isActive = useMemo(() => {
    if (pathname.startsWith('/settings') || pathname.startsWith('/owner')) {
      return pathname === href;
    }

    return (
      (pathname === '/' && href === '/') ||
      pathname === href ||
      pathname?.startsWith(`${href}/`) ||
      (pathname?.includes('/preview-course') && href == '/')
    );
  }, [href, pathname]);

  const ignoreLogin = Boolean(user?.userId || !isProtected);

  const handleClick = () => (ignoreLogin ? router.push(href) : null);

  return (
    <AuthRedirect ignore={ignoreLogin}>
      <button
        onClick={handleClick}
        type="button"
        className={cn(
          'flex w-full text-sm text-muted-foreground items-center py-3.5 px-3 hover:bg-muted rounded-lg transition-background group duration-300 ease-in-out',
          isActive && 'bg-muted text-primary font-medium',
        )}
      >
        <div className="flex justify-between items-center w-full text-left">
          <div className="flex items-center gap-x-2">
            {Icon && (
              <Icon
                size={20}
                className={cn(
                  'h-5 w-5 font-medium',
                  isActive && 'text-primary font-medium animate-spin-once',
                )}
              />
            )}
            {t(label)}
          </div>
        </div>
      </button>
    </AuthRedirect>
  );
};
