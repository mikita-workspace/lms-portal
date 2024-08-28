'use client';

import { User } from '@prisma/client';
import { useTranslations } from 'next-intl';

import { OtpForm } from './otp-form';
import { PublicProfileForm } from './public-profile-form';

type AdvancedOptionsProps = {
  initialData: User;
};

export const AdvancedOptions = ({ initialData }: AdvancedOptionsProps) => {
  const t = useTranslations('settings');

  return (
    <div className="flex flex-col gap-4 mt-8">
      <p className="font-medium text-xl">{t('advancedOptions')}</p>
      <OtpForm initialData={initialData} />
      <PublicProfileForm initialData={initialData} />
    </div>
  );
};
