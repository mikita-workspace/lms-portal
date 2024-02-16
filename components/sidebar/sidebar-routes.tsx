'use client';

import { BarChart4, Compass, Crown, Layout, List } from 'lucide-react';
import { usePathname } from 'next/navigation';

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

export const SideBarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes('/teacher');

  const routes = isTeacherPage ? teacherRoutes : studentRoutes;

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
