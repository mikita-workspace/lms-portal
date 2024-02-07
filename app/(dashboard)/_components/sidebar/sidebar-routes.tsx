'use client';

import { BarChart4, Compass, Layout, List, Shield } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { SideBarItem } from './sidebar-item';

const guestRoutes = [
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

const settingsRoutes = [
  {
    icon: Shield,
    label: 'Account',
    href: '/settings/account',
  },
];

export const SideBarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes('/teacher');
  const isSettingsPage = pathname?.includes('/settings');

  const routes = useMemo(() => {
    if (isTeacherPage) {
      return teacherRoutes;
    }

    if (isSettingsPage) {
      return settingsRoutes;
    }

    return guestRoutes;
  }, [isSettingsPage, isTeacherPage]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col w-full space-y-1.5 p-3">
        {routes.map((route) => (
          <SideBarItem key={route.href} href={route.href} icon={route.icon} label={route.label} />
        ))}
      </div>
    </div>
  );
};
