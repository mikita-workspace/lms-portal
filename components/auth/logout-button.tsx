'use client';

import { logout } from '@/actions/auth';

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const handleOnClick = () => {
    logout();
  };

  return (
    <span onClick={handleOnClick} className="cursor-pointer">
      {children}
    </span>
  );
};
