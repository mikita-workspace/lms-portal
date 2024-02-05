'use client';

import { signOut } from 'next-auth/react';

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const handleSignOut = () => {
    signOut();
  };

  return <span onClick={handleSignOut}>{children}</span>;
};
