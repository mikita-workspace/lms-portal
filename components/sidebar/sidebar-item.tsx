'use client';

import { LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { TextBadge } from '@/components/common/text-badge';
import { useCurrentUser } from '@/hooks/use-current-user';
import { cn } from '@/lib/utils';

import { AuthModal } from '../modals/auth-modal';

type SideBarItemProps = {
  href: string;
  icon: LucideIcon;
  isNew?: boolean;
  isProtected?: boolean;
  label: string;
};

export const SideBarItem = ({ href, icon: Icon, isNew, isProtected, label }: SideBarItemProps) => {
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
    <AuthModal ignore={ignoreLogin}>
      <button
        onClick={handleClick}
        type="button"
        className={cn(
          'flex w-full text-sm text-muted-foreground items-center py-3.5 px-3 hover:bg-muted rounded-lg transition-background group duration-300 ease-in-out',
          isActive && 'bg-muted text-primary font-medium',
        )}
      >
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-x-2">
            <Icon
              size={20}
              className={cn(
                'h-5 w-5 font-medium',
                isActive && 'text-primary font-medium animate-spin-once',
              )}
            />
            {t(label)}
          </div>
          {isNew && <TextBadge label={t('new')} variant="green" />}
        </div>
      </button>
    </AuthModal>
  );
};
