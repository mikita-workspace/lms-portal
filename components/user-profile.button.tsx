'use client';

import { SignInButton, useAuth, useUser } from '@clerk/nextjs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { cva } from 'class-variance-authority';
import { LogIn, LogOut, Settings2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

const dropdownMenuContentStyles = cva(
  'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-72 mr-4 mt-2',
);

const dropdownMenuItemStyles = cva(
  'relative flex select-none items-center rounded-sm text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 p-2 cursor-pointer',
);

export const UserProfileButton = () => {
  const { isSignedIn, user } = useUser();
  const { signOut } = useAuth();

  const router = useRouter();

  const handleSettings = async () => router.push('/settings/clerk');
  const handleSignOut = async () => signOut(() => router.push('/'));

  return isSignedIn ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="relative block hover:cursor-pointer">
        <div className="relative flex shrink-0 overflow-hidden rounded-full h-[36px] w-[36px] border items-center justify-center">
          {user?.imageUrl ? (
            <Image src={user.imageUrl} alt="User Profile" height={36} width={36} />
          ) : (
            <p className="text-sm font-semibold">{`${user.firstName?.[0]}${user.lastName?.[0]}`}</p>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={dropdownMenuContentStyles()}>
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold">{user.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.emailAddresses[0].emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-muted" />
        <DropdownMenuItem className={dropdownMenuItemStyles()} onClick={handleSettings}>
          <Settings2 className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-muted" />
        <DropdownMenuItem className={dropdownMenuItemStyles()} onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <SignInButton afterSignInUrl="/">
      <Button variant="outline">
        <LogIn className="h-4 w-4 mr-2" />
        Login
      </Button>
    </SignInButton>
  );
};
