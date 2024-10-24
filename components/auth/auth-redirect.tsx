'use client';

import Link from 'next/link';

type AuthRedirectProps = {
  children: React.ReactNode;
  ignore?: boolean;
};

export const AuthRedirect = ({ children, ignore = false }: AuthRedirectProps) => {
  return ignore ? (
    children
  ) : (
    <Link className="w-full" href="/login">
      {children}
    </Link>
  );
};
