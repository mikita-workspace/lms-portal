'use client';

import { User, UserOAuth } from '@prisma/client';
import { format } from 'date-fns/format';
import { useTranslations } from 'next-intl';

import { authIcons } from '@/components/auth/auth-icons';
import { OAUTH_LABELS, Provider } from '@/constants/auth';
import { TIMESTAMP_TEMPLATE } from '@/constants/common';
import { capitalize } from '@/lib/utils';

type ConnectedAccountsProps = {
  initialData: User & { oauth: UserOAuth[] };
};

export const ConnectedAccounts = ({ initialData }: ConnectedAccountsProps) => {
  const t = useTranslations('settings');

  return (
    <div className="flex flex-col gap-4 mt-8">
      <p className="font-medium text-xl">{t('connectedAccounts')}</p>
      {initialData.oauth.map((oauth) => {
        const provider = oauth.provider as Provider;

        const Icon = authIcons[provider];
        const oAuthLabel = OAUTH_LABELS[provider] ?? capitalize(provider);

        return (
          <div
            key={oauth.providerId}
            className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4"
          >
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2 mb-2">
                <Icon size={20} />
                <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {oAuthLabel}
                </span>
              </div>
              <p className="text-muted-foreground text-xs">
                {t('otpForm.addedAt', {
                  date: format(oauth.createdAt, TIMESTAMP_TEMPLATE),
                })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
