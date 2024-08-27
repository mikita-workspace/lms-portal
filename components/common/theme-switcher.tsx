'use client';

import { Laptop2, MoonStar, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';

import {
  DropdownMenuItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui';

type ThemeSwitcherProps = {
  isMenu?: boolean;
};

export const ThemeSwitcher = ({ isMenu = false }: ThemeSwitcherProps) => {
  const t = useTranslations('switcher');

  const { theme, setTheme } = useTheme();

  const ThemeIcon = useMemo(() => {
    if (theme === 'system') {
      return Laptop2;
    }

    return theme === 'light' ? Sun : MoonStar;
  }, [theme]);

  const handleTheme = (theme: string) => setTheme(theme);

  const DropDown = () => (
    <Select onValueChange={handleTheme} defaultValue={theme}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Select a theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup className="z-10">
          <SelectItem value="system">{t('system')}</SelectItem>
          <SelectItem value="dark">{t('dark')}</SelectItem>
          <SelectItem value="light">{t('light')}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );

  return isMenu ? (
    <DropdownMenuItem className="hover:cursor-pointer">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center">
          <ThemeIcon className="mr-2 h-4 w-4" />
          <span>{t('theme')}</span>
        </div>
        <DropDown />
      </div>
    </DropdownMenuItem>
  ) : (
    <DropDown />
  );
};
