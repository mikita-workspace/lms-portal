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
      {routes.map((route) => (
        <SideBarItem key={route.href} href={route.href} icon={route.icon} label={route.label} />
      ))}
    </div>
  );
};
