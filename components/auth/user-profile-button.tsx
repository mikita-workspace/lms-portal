'use client';

import { SignInButton, useAuth, useUser } from '@clerk/nextjs';
import { LogIn, LogOut, Settings2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// import { AuthModal } from './auth/auth-modal';
import { Button } from '@/components/ui/button';

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

export const UserProfileButton = () => {
  const { isSignedIn, user } = useUser();
  const { signOut } = useAuth();

  const router = useRouter();

  const handleSettings = async () => router.push('/settings/clerk');
  const handleSignOut = async () => signOut(() => router.push('/'));

  return isSignedIn ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="relative block hover:cursor-pointer">
        <Avatar>
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback>{`${user.firstName?.[0]}${user.lastName?.[0]}`}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 mr-4 mt-1">
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold">{user.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.emailAddresses[0].emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-muted" />
        <DropdownMenuItem className="hover:cursor-pointer" onClick={handleSettings}>
          <Settings2 className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-muted" />
        <DropdownMenuItem className="hover:cursor-pointer" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    // <AuthModal />
    <SignInButton afterSignInUrl="/">
      <Button variant="outline">
        <LogIn className="h-4 w-4 mr-2" />
        Login
      </Button>
    </SignInButton>
  );
};
