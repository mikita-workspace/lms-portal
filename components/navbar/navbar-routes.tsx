'use client';

import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

import { UserProfileButton } from '@/components/auth/user-profile-button';
import { SearchInput } from '@/components/common/search-input';
import { Button, Skeleton } from '@/components/ui';
import { AuthStatus } from '@/constants/auth';
import { useCurrentUser } from '@/hooks/use-current-user';

import { Notifications } from '../notifications/notifications';

type NavBarRoutesProps = {
  globalProgress?: {
    progressPercentage: number;
    total: number;
    value: number;
  } | null;
};

export const NavBarRoutes = ({ globalProgress }: NavBarRoutesProps) => {
  const pathname = usePathname();
  const { user, status } = useCurrentUser();

  const isChatPage = pathname?.startsWith('/chat');
  const isCoursePage = pathname?.startsWith('/courses');
  const isOwnerPage = pathname?.startsWith('/owner');
  const isSearchPage = pathname === '/';
  const isSettingsPage = pathname?.startsWith('/settings');
  const isStudentPage = pathname?.includes('/chapter') && !pathname?.includes('/teacher');
  const isTeacherPage = pathname?.startsWith('/teacher');

  return (
    <>
      {isSearchPage && (
        <Suspense>
          <div className="hidden md:block -center">
            <SearchInput />
          </div>
        </Suspense>
      )}
      {status === AuthStatus.LOADING ? (
        <div className="flex items-center space-x-4 ml-auto">
          <div className="space-y-2">
            <Skeleton className="h-3 w-[100px]" />
            <Skeleton className="h-3 w-[75px]" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      ) : (
        <div className="flex gap-x-2 ml-auto items-center">
          {user?.userId && (
            <>
              {(isCoursePage ||
                isStudentPage ||
                isTeacherPage ||
                isChatPage ||
                isSettingsPage ||
                isOwnerPage) && (
                <Link href="/">
                  <Button size="sm" variant="ghost">
                    <LogOut className="h-4 w-4 mr-2" />
                    {isTeacherPage || isOwnerPage ? 'Exit' : 'Back to courses'}
                  </Button>
                </Link>
              )}
            </>
          )}
          <Notifications />
          <UserProfileButton globalProgress={globalProgress} />
        </div>
      )}
    </>
  );
};
