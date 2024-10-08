'use client';

import {
  BarChart4,
  Compass,
  Crown,
  FileSliders,
  Landmark,
  Layout,
  List,
  Rss,
  Settings2,
  Tags,
  Users,
  Wallet2,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { AuthStatus } from '@/constants/auth';
import { useCurrentUser } from '@/hooks/use-current-user';

import { SubscriptionBanner } from '../common/subscription-banner';
import { SideBarItem } from './sidebar-item';

const studentRoutes = [
  {
    href: '/',
    icon: Compass,
    isNew: false,
    isProtected: false,
    label: 'browse',
  },
  {
    href: '/dashboard',
    icon: Layout,
    isNew: false,
    isProtected: true,
    label: 'dashboard',
  },
  {
    href: '/leaderboard',
    icon: Crown,
    isNew: false,
    isProtected: true,
    label: 'leaderboard',
  },
];

const teacherRoutes = [
  {
    href: '/teacher/courses',
    icon: List,
    isNew: false,
    isProtected: true,
    label: 'courses',
  },
  {
    href: '/teacher/analytics',
    isNew: false,
    isProtected: true,
    icon: BarChart4,
    label: 'analytics',
  },
];

const settingsRoutes = [
  {
    href: '/settings',
    icon: Settings2,
    isNew: false,
    isProtected: true,
    label: 'general',
  },
  {
    href: '/settings/billing',
    icon: Wallet2,
    isNew: false,
    isProtected: true,
    label: 'billingAndSubscription',
  },
  {
    href: '/settings/notifications',
    icon: Rss,
    isNew: false,
    isProtected: true,
    label: 'notifications',
  },
];

const paymentsRoutes = [
  {
    href: '/owner',
    icon: Landmark,
    isNew: false,
    isProtected: true,
    label: 'payments',
  },
  {
    href: '/owner/promo',
    isProtected: true,
    label: 'promo',
    isNew: false,
    icon: Tags,
  },
  {
    href: '/owner/users',
    isProtected: true,
    label: 'users',
    isNew: false,
    icon: Users,
  },
  {
    href: '/owner/config',
    isProtected: true,
    label: 'config',
    isNew: false,
    icon: FileSliders,
  },
];

export const SideBarRoutes = () => {
  const { user, status } = useCurrentUser();
  const pathname = usePathname();

  const isSettingsPage = pathname?.includes('/settings');
  const isTeacherPage = pathname?.includes('/teacher');
  const isPaymentsPage = pathname?.includes('/owner');

  const isLoading = status === AuthStatus.LOADING;

  const routes = useMemo(() => {
    if (isSettingsPage) {
      return settingsRoutes;
    }

    if (isPaymentsPage) {
      return paymentsRoutes;
    }

    return isTeacherPage ? teacherRoutes : studentRoutes;
  }, [isPaymentsPage, isSettingsPage, isTeacherPage]);

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
      {!isLoading && !user?.hasSubscription && <SubscriptionBanner />}
    </div>
  );
};
