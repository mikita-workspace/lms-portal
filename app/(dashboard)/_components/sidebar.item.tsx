'use client';

import { LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

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

  const isActive =
    (pathname === '/' && href === '/') || pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <button
      onClick={handleClick}
      type="button"
      className={cn(
        'flex w-full text-sm text-muted-foreground items-center py-3.5 px-3 hover:bg-muted rounded-lg transition-background group duration-300 ease-in-out ',
        isActive && 'bg-muted text-primary font-medium',
      )}
    >
      <div className="flex ite gap-x-2 items-center">
        <Icon
          size={20}
          className={cn(
            'h-5 w-5 font-medium',
            isActive && ' text-primary font-medium animate-spin-once',
          )}
        />
        {label}
      </div>
    </button>
  );
};
