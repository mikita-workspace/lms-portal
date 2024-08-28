'use client';

import { useTranslations } from 'next-intl';
import { BiLoaderAlt } from 'react-icons/bi';

export const CommonLoader = () => {
  const t = useTranslations('app');

  return (
    <div className="w-full h-full flex items-center justify-center">
      <BiLoaderAlt className="h-4 w-4 animate-spin text-secondary-foreground mr-2" />
      <p className="text-sm">{t('loading')}</p>
    </div>
  );
};
