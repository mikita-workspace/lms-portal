'use client';

import { User } from '@prisma/client';
import { useTranslations } from 'next-intl';

import { useAppConfigStore } from '@/hooks/store/use-app-config-store';

import { ChristmasForm } from './christmas-form';
import { OtpForm } from './otp-form';
import { PublicProfileForm } from './public-profile-form';

type AdvancedOptionsProps = {
  initialData: User;
};

export const AdvancedOptions = ({ initialData }: AdvancedOptionsProps) => {
  const t = useTranslations('settings');

  const { config } = useAppConfigStore((state) => ({ config: state.config }));

  return (
    <div className="flex flex-col gap-4 mt-8">
      <p className="font-medium text-xl">{t('advancedOptions')}</p>
      <OtpForm initialData={initialData} />
      <PublicProfileForm initialData={initialData} />
      {config?.features?.christmas && <ChristmasForm />}
    </div>
  );
};
