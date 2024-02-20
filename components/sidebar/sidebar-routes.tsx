'use client';

import {
  BarChart4,
  Compass,
  Crown,
  Layout,
  List,
  LockKeyhole,
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
    icon: Compass,
    label: 'Browse',
    href: '/',
  },
  {
    icon: Layout,
    label: 'Dashboard',
    href: '/dashboard',
  },
  { icon: Crown, label: 'Leaderboard', href: '/leaderboard' },
];

const teacherRoutes = [
  {
    icon: List,
    label: 'Courses',
    href: '/teacher/courses',
  },
  {
    icon: BarChart4,
    label: 'Analytics',
    href: '/teacher/analytics',
  },
];

const settingsRoutes = (userId?: string) => [
  {
    icon: Settings2,
    label: 'General',
    href: '/settings',
  },
  {
    icon: Wallet2,
    label: 'Billing',
    href: '/settings/billing',
  },
  ...(isOwner(userId)
    ? [
        {
          icon: LockKeyhole,
          label: 'Admin',
          href: '/settings/admin',
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
          <SideBarItem href={route.href} icon={route.icon} key={route.href} label={route.label} />
        ))}
      </div>
    </div>
  );
};
