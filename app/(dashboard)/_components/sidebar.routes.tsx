'use client';

import { BarChart4, Compass, Layout, List } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { SideBarItem } from './sidebar.item';

const guestRoutes = [
  {
    icon: Layout,
    label: 'Dashboard',
    href: '/',
  },
  {
    icon: Compass,
    label: 'Browse',
    href: '/search',
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

export const SideBarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes('/teacher');

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

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
