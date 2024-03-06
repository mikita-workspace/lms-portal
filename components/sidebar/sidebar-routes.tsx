'use client';

import {
  BarChart4,
  Compass,
  Crown,
  Landmark,
  Layout,
  List,
  Settings2,
  Tags,
  Users,
  Wallet2,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

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

const settingsRoutes = [
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
];

const paymentsRoutes = [
  {
    href: '/owner',
    icon: Landmark,
    isNew: false,
    isProtected: true,
    label: 'Payments',
  },
  {
    href: '/owner/promo',
    isProtected: true,
    label: 'Promo',
    isNew: false,
    icon: Tags,
  },
  {
    href: '/owner/users',
    isProtected: true,
    label: 'Users',
    isNew: false,
    icon: Users,
  },
];

export const SideBarRoutes = () => {
  const pathname = usePathname();

  const isSettingsPage = pathname?.includes('/settings');
  const isTeacherPage = pathname?.includes('/teacher');
  const isPaymentsPage = pathname?.includes('/owner');

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
    </div>
  );
};
