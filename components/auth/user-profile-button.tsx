'use client';

import { ExternalLink, Laptop2, LogIn, LogOut, MoonStar, Settings2, Sun } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import { MdOutlineWorkspacePremium } from 'react-icons/md';
import { PiStudentBold } from 'react-icons/pi';

import { UserRole } from '@/constants/auth';
import { NOVA_CHAT_URL } from '@/constants/common';
import { useCurrentUser } from '@/hooks/use-current-user';
import { isOwner } from '@/lib/owner';
import { getFallbackName } from '@/lib/utils';

import { ProgressBar } from '../common/progress-bar';
import { TextBadge } from '../common/text-badge';
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui';
import { LoginButton } from './login-button';
import { LogoutButton } from './logout-button';

type UserProfileButtonProps = {
  globalProgress?: {
    progressPercentage: number;
    total: number;
    value: number;
  } | null;
};

export const UserProfileButton = ({ globalProgress }: UserProfileButtonProps) => {
  const { user } = useCurrentUser();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const ThemeIcon = useMemo(() => {
    if (theme === 'system') {
      return Laptop2;
    }

    return theme === 'light' ? Sun : MoonStar;
  }, [theme]);

  const handleTheme = (theme: string) => setTheme(theme);

  const handleSettings = () => router.push('/settings');

  const isRestricted = ![UserRole.ADMIN, UserRole.TEACHER].includes(user?.role as UserRole);
  const isAdmin = user?.role === UserRole.ADMIN;
  const isStudent = user?.role === UserRole.STUDENT;
  const isTeacher = user?.role === UserRole.TEACHER;

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="relative block hover:cursor-pointer">
        <Avatar>
          <AvatarImage src={user.image || ''} />
          <AvatarFallback>{getFallbackName(user.name as string)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 mr-4 mt-1">
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-1">
            <div className="flex gap-1 items-center">
              <p className="text-sm font-semibold">{user.name}</p>
              {(isOwner(user.userId) || isAdmin) && (
                <MdOutlineWorkspacePremium className="w-4 h-4 text-yellow-500/90 dark:text-yellow-400" />
              )}
              {isTeacher && <FaChalkboardTeacher className="w-4 h-4 text-purple-700" />}
              {isStudent && <PiStudentBold className="w-4 h-4 text-indigo-700" />}
            </div>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        {globalProgress && globalProgress.total > 0 && (
          <>
            <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-muted" />
            <div className="p-2 flex flex-col space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <p>Progress</p>
                <p>
                  {globalProgress.value}/{globalProgress.total} Points
                </p>
              </div>

              <ProgressBar
                showText={false}
                variant="success"
                size="sm"
                value={globalProgress.progressPercentage}
              />
            </div>
          </>
        )}
        <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-muted" />
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => router.push('/chat')}
          disabled={isRestricted}
        >
          <IoChatboxEllipsesOutline className="mr-2 h-4 w-4" />
          Chat&nbsp;&nbsp;
          <TextBadge label="AI" variant="yellow" />
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:cursor-pointer" onClick={handleSettings}>
          <Settings2 className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-muted" />
        <DropdownMenuItem className="hover:cursor-pointer">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center">
              <ThemeIcon className="mr-2 h-4 w-4" />
              <span>Theme</span>
            </div>
            <Select onValueChange={handleTheme} defaultValue={theme}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="z-10">
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-muted" />
        <Link href={NOVA_CHAT_URL} target="_blank">
          <DropdownMenuItem className="hover:cursor-pointer">
            <ExternalLink className="mr-2 h-4 w-4" />
            NovaChat&nbsp;|&nbsp;GPT&nbsp;&nbsp;
            <TextBadge label="Telegram" variant="indigo" />
          </DropdownMenuItem>
        </Link>
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
