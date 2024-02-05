'use client';

import { LogOut, Settings2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useCurrentUser } from '@/hooks/use-current-user';

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
} from '../ui';
import { LogoutButton } from '.';
import { LoginButton } from '.';

export const UserProfileButton = () => {
  const user = useCurrentUser();
  const router = useRouter();

  const usernameFallback = 'MK';

  const handleSettings = async () => router.push('/settings/account');

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="relative block hover:cursor-pointer">
        <Avatar>
          {user.image ? (
            <AvatarImage src={user.image} />
          ) : (
            <AvatarFallback>{usernameFallback}</AvatarFallback>
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
        <DropdownMenuItem className="hover:cursor-pointer" onClick={handleSettings}>
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
