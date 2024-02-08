'use client';

import { LogOut, MoonStar, Settings2, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { AuthStatus } from '@/constants/auth';
import { useCurrentUser } from '@/hooks/use-current-user';
import { getFallbackName } from '@/lib/utils';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Skeleton,
} from '../ui';
import { LoginButton } from './login-button';
import { LogoutButton } from './logout-button';

export const UserProfileButton = () => {
  const { user, status } = useCurrentUser();
  const { theme, setTheme } = useTheme();

  const handleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  if (status === AuthStatus.LOADING) {
    return (
      <div className="flex items-center space-x-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-[100px]" />
          <Skeleton className="h-3 w-[75px]" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    );
  }

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="relative block hover:cursor-pointer">
        <Avatar>
          {user.image ? (
            <AvatarImage src={user.image} />
          ) : (
            <AvatarFallback>{getFallbackName(user.name as string)}</AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 mr-4 mt-1">
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-muted" />
        <DropdownMenuItem className="hover:cursor-pointer" onClick={handleTheme}>
          {theme === 'light' ? (
            <>
              <MoonStar className="mr-2 h-4 w-4" />
              Dark mode
            </>
          ) : (
            <>
              <Sun className="mr-2 h-4 w-4" />
              Light mode
            </>
          )}
        </DropdownMenuItem>
        {/* TODO: Add settings modal here */}
        <DropdownMenuItem className="hover:cursor-pointer" onClick={() => {}}>
          <Settings2 className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-muted" />
        <LogoutButton>
          <DropdownMenuItem className="hover:cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <LoginButton />
  );
};
