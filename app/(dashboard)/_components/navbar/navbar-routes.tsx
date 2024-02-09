'use client';

import { BookMarked, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { UserProfileButton } from '@/components/auth/user-profile-button';
import { Button, Skeleton } from '@/components/ui';
import { AuthStatus } from '@/constants/auth';
import { useCurrentUser } from '@/hooks/use-current-user';

export const NavBarRoutes = () => {
  const pathname = usePathname();
  const { user, status } = useCurrentUser();

  if (status === AuthStatus.LOADING) {
    return (
      <div className="flex items-center space-x-4 ml-auto">
        <div className="space-y-2">
          <Skeleton className="h-3 w-[100px]" />
          <Skeleton className="h-3 w-[75px]" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    );
  }

  const isStudentPage = pathname?.includes('/chapter');
  const isTeacherPage = pathname?.startsWith('/teacher');

  return (
    <div className="flex gap-x-2 ml-auto items-center">
      {user?.userId && (
        <>
          {isTeacherPage || isStudentPage ? (
            <Link href="/">
              <Button size="sm" variant="ghost">
                <LogOut className="h-4 w-4 mr-2" />
                Exit
              </Button>
            </Link>
          ) : (
            <Link href="/teacher/courses">
              <Button size="sm" variant="ghost">
                <BookMarked className="h-4 w-4 mr-2" />
                Teacher mode
              </Button>
            </Link>
          )}
        </>
      )}
      <UserProfileButton />
    </div>
  );
};
