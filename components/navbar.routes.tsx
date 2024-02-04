'use client';

import { useAuth } from '@clerk/nextjs';
import { BookMarked, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// import { ThemeSwitcher } from './theme-switcher';
import { Button } from './ui/button';
import { UserProfileButton } from './user-profile.button';

export const NavBarRoutes = () => {
  const pathname = usePathname();
  const { userId } = useAuth();

  const isTeacherPage = pathname?.startsWith('/teacher');
  const isStudentPage = pathname?.includes('/chapter');
  const isSettingsPage = pathname?.startsWith('/settings');

  return (
    <div className="flex gap-x-2 ml-auto items-center">
      {userId && (
        <>
          {isTeacherPage || isStudentPage || isSettingsPage ? (
            <Link href="/">
              <Button size="sm" variant="ghost">
                <LogOut className="h-4 w-4 mr-2" />
                Go back
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
      {/* <ThemeSwitcher /> */}
      <UserProfileButton />
    </div>
  );
};
