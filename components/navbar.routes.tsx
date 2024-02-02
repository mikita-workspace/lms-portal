'use client';

import { UserButton as ClerkUserButton } from '@clerk/nextjs';

export const NavBarRoutes = () => {
  return (
    <div className="flex gap-x-2 ml-3">
      <ClerkUserButton />
    </div>
  );
};
