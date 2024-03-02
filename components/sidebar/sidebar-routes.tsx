'use client';

import {
  BarChart4,
  Compass,
  CreditCard,
  Crown,
  Layout,
  List,
  Settings2,
  Wallet2,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { useCurrentUser } from '@/hooks/use-current-user';
import { isOwner } from '@/lib/owner';

import { SideBarItem } from './sidebar-item';

const studentRoutes = [
  {
    href: '/',
    icon: Compass,
    isNew: false,
    isProtected: false,
    label: 'Browse',
  },
  {
    href: '/dashboard',
    icon: Layout,
    isNew: false,
    isProtected: true,
    label: 'Dashboard',
  },
  {
    href: '/leaderboard',
    icon: Crown,
    isNew: true,
    isProtected: true,
    label: 'Leaderboard',
  },
];

const teacherRoutes = [
  {
    href: '/teacher/courses',
    icon: List,
    isNew: false,
    isProtected: true,
    label: 'Courses',
  },
  {
    href: '/teacher/analytics',
    isNew: false,
    isProtected: true,
    icon: BarChart4,
    label: 'Analytics',
  },
];

const settingsRoutes = (userId?: string) => [
  {
    href: '/settings',
    icon: Settings2,
    isNew: false,
    isProtected: true,
    label: 'General',
  },
  {
    href: '/settings/billing',
    icon: Wallet2,
    isNew: false,
    isProtected: true,
    label: 'Billing',
  },
  ...(isOwner(userId)
    ? [
        {
          href: '/settings/stripe',
          icon: CreditCard,
          isNew: false,
          isProtected: true,
          label: 'Stripe',
        },
      ]
    : []),
];

export const SideBarRoutes = () => {
  const { user } = useCurrentUser();

  const pathname = usePathname();

  const isSettingsPage = pathname?.includes('/settings');
  const isTeacherPage = pathname?.includes('/teacher');

  const routes = useMemo(() => {
    if (isSettingsPage) {
      return settingsRoutes(user?.userId);
    }

    return isTeacherPage ? teacherRoutes : studentRoutes;
  }, [isSettingsPage, isTeacherPage, user?.userId]);

  return (
    <div className="flex flex-col w-full h-full p-3 justify-between">
      <div className="flex flex-col w-full space-y-1.5">
        {routes.map((route) => (
          <SideBarItem
            href={route.href}
            icon={route.icon}
            isNew={route.isNew}
            isProtected={route.isProtected}
            key={route.href}
            label={route.label}
          />
        ))}
      </div>
    </div>
  );
};
