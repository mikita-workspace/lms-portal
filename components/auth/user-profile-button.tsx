'use client';

import { Laptop2, LogIn, LogOut, MoonStar, Settings2, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';

import { useCurrentUser } from '@/hooks/use-current-user';
import { capitalize, getFallbackName } from '@/lib/utils';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui';
import { LoginButton } from './login-button';
import { LogoutButton } from './logout-button';

export const UserProfileButton = () => {
  const { user } = useCurrentUser();
  const { theme, setTheme } = useTheme();

  const ThemeIcon = useMemo(() => {
    if (theme === 'system') {
      return Laptop2;
    }

    return theme === 'light' ? MoonStar : Sun;
  }, [theme]);

  const handleTheme = () => {
    if (theme === 'system') {
      return setTheme('light');
    }

    if (theme === 'light') {
      return setTheme('dark');
    }

    if (theme === 'dark') {
      return setTheme('system');
    }
  };

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="relative block hover:cursor-pointer">
        <Avatar>
          {user.image && <AvatarImage src={user.image} />}
          <AvatarFallback>{getFallbackName(user.name as string)}</AvatarFallback>
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
          <ThemeIcon className="mr-2 h-4 w-4" />
          {`${capitalize(theme || 'system')} theme`}
        </DropdownMenuItem>
        {/* TODO: Add settings here. Temporary disabled. */}
        <DropdownMenuItem className="hover:cursor-pointer" onClick={() => {}} disabled>
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
    <LoginButton>
      <Button variant="outline">
        <LogIn className="h-4 w-4 mr-2" />
        Login
      </Button>
    </LoginButton>
  );
};
