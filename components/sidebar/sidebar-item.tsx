'use client';

import { LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { TextBadge } from '@/components/common/text-badge';
import { cn } from '@/lib/utils';

type SideBarItemProps = {
  href: string;
  icon: LucideIcon;
  label: string;
};

export const SideBarItem = ({ href, icon: Icon, label }: SideBarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = () => router.push(href);

  const isActive = useMemo(() => {
    if (pathname.startsWith('/settings')) {
      return pathname === href;
    }

    return (
      (pathname === '/' && href === '/') ||
      pathname === href ||
      pathname?.startsWith(`${href}/`) ||
      (pathname?.includes('/landing-course') && href == '/')
    );
  }, [href, pathname]);

  return (
    <button
      onClick={handleClick}
      type="button"
      className={cn(
        'flex w-full text-sm text-muted-foreground items-center py-3.5 px-3 hover:bg-muted rounded-lg transition-background group duration-300 ease-in-out ',
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
          {label}
        </div>
        {['Leaderboard'].includes(label) && <TextBadge label="new" variant="green" />}
      </div>
    </button>
  );
};
