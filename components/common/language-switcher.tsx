'use client';

import { setDefaultOptions } from 'date-fns';
import { be, enUS, ru } from 'date-fns/locale';
import { Languages } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { changeLocale } from '@/actions/locale/change-locale';
import { LOCALE, SUPPORTED_LOCALES } from '@/constants/locale';
import { useHydration } from '@/hooks/use-hydration';

import {
  DropdownMenuItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
} from '../ui';
type LanguageSwitcherProps = {
  isMenu?: boolean;
};

export const LanguageSwitcher = ({ isMenu = false }: LanguageSwitcherProps) => {
  const t = useTranslations('switcher');

  const locale = useLocale();
  const router = useRouter();

  const { isMounted } = useHydration();

  if (!isMounted) {
    return <Skeleton className="h-[35px] w-[120px]" />;
  }

  const handleLanguage = async (lang: string) => {
    await changeLocale(lang);

    switch (lang) {
      case LOCALE.RU:
        setDefaultOptions({ locale: ru });
        break;
      case LOCALE.BE:
        setDefaultOptions({ locale: be });
        break;
      default:
        setDefaultOptions({ locale: enUS });
        break;
    }

    router.refresh();
  };

  const DropDown = () => (
    <Select onValueChange={handleLanguage} defaultValue={locale}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup className="z-10">
          {SUPPORTED_LOCALES.map(({ key, title }) => (
            <SelectItem key={key} value={key}>
              {title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );

  return isMenu ? (
    <DropdownMenuItem className="hover:cursor-pointer">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center">
          <Languages className="mr-2 h-4 w-4" />
          <span>{t('language')}</span>
        </div>
        <DropDown />
      </div>
    </DropdownMenuItem>
  ) : (
    <DropDown />
  );
};
