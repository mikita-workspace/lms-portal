'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useMediaQuery } from 'react-responsive';

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui';

const legalLinks = [
  { key: 'cookiePolicy', href: '/legal/cookies-policy' },
  { key: 'termsAndCondition', href: '/legal/terms' },
  { key: 'privacyPolicy', href: '/legal/privacy-policy' },
];

export const LegalMenu = () => {
  const t = useTranslations('footer.legal');
  const isMd = useMediaQuery({ maxWidth: 768 });

  return isMd ? (
    <Drawer>
      <DrawerTrigger asChild className="block hover:cursor-pointer">
        <div className="flex items-center gap-x-1">
          <span>{t('title')}</span>
          <ChevronDown className="h-3 w-3" />
        </div>
      </DrawerTrigger>
      <DrawerContent className="p-2 mb-2 gap-y-1">
        {legalLinks.map(({ key, href }) => (
          <div key={key} className="hover:bg-muted hover:cursor-pointer p-2 rounded-md mt-2">
            <Link href={href}>{t(key)}</Link>
          </div>
        ))}
      </DrawerContent>
    </Drawer>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="block hover:cursor-pointer">
        <div className="flex items-center gap-x-1">
          <span>{t('title')}</span>
          <ChevronDown className="h-3 w-3" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[260px] mr-4 mt-1 p-2">
        {legalLinks.map(({ key, href }) => (
          <DropdownMenuItem key={key} className="hover:cursor-pointer p-2">
            <Link href={href}> {t(key)}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};