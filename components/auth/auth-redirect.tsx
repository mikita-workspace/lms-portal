'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type AuthRedirectProps = {
  children: React.ReactNode;
  ignore?: boolean;
};

export const AuthRedirect = ({ children, ignore = false }: AuthRedirectProps) => {
  const pathname = usePathname();

  return ignore ? (
    children
  ) : (
    <Link className="w-full" href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}>
      {children}
    </Link>
  );
};
