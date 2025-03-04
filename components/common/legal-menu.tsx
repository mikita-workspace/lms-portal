'use client';

import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import SmartDropDownMenu from '@/hoc/smart-drop-down-menu';

export const LegalMenu = () => {
  const t = useTranslations('footer.legal');

  const body = [
    { title: t('cookiePolicy'), href: '/docs/cookies-policy' },
    { title: t('termsAndCondition'), href: '/docs/terms' },
    { title: t('privacyPolicy'), href: '/docs/privacy-policy' },
    { title: t('releasesNotes'), href: '/docs/releases' },
  ];

  return (
    <SmartDropDownMenu body={body}>
      <div className="flex items-center gap-x-1">
        <span>{t('title')}</span>
        <ChevronDown className="h-3 w-3" />
      </div>
    </SmartDropDownMenu>
  );
};
