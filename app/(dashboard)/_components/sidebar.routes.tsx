'use client';

import { Compass, Layout } from 'lucide-react';

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

export const SideBarRoutes = () => {
  const routes = guestRoutes;

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
