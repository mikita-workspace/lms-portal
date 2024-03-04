'use client';

import { BookMarked, Laptop2, LogIn, LogOut, MoonStar, Settings2, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';

import { UserRole } from '@/constants/auth';
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
      <DropdownMenuContent className="w-[260px] mr-4 mt-1">
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-1">
            <div className="flex gap-1 items-center">
              <p className="text-sm font-semibold">{user.name}</p>
              <div className="ml-1">
                {(isOwner(user.userId) || isAdmin) && <TextBadge label="Admin" variant="green" />}
                {isTeacher && <TextBadge label="Teacher" variant="indigo" />}
                {isStudent && <TextBadge label="Student" variant="default" />}
              </div>
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
        {(isAdmin || isTeacher) && (
          <>
            <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-muted" />
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => router.push('/teacher/courses')}
            >
              <BookMarked className="h-4 w-4 mr-2" />
              Manage courses
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer" onClick={() => router.push('/chat')}>
              <IoChatboxEllipsesOutline className="mr-2 h-4 w-4" />
              Chat&nbsp;&nbsp;
              <TextBadge label="AI" variant="yellow" />
            </DropdownMenuItem>
          </>
        )}
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
        <DropdownMenuItem className="hover:cursor-pointer" onClick={handleSettings}>
          <Settings2 className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-muted" />
        <LogoutButton>
          <DropdownMenuItem className="hover:cursor-pointer text-red-500">
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
