'use client';

import { useTranslations } from 'next-intl';

import { OAUTH_LABELS, Provider } from '@/constants/auth';
import { capitalize, cn } from '@/lib/utils';

import { Button, ButtonProps } from '../ui';
import { authIcons } from './auth-icons';

type OAuthButton = {
  hasCredentialsProvider?: boolean;
  onSignIn: () => void;
  provider: Provider;
} & ButtonProps;

export const OAuthButton = ({
  hasCredentialsProvider = false,
  onSignIn,
  provider,
  ...props
}: OAuthButton) => {
  const t = useTranslations('auth-form');

  const Icon = authIcons[provider];
  const oAuthLabel = OAUTH_LABELS[provider] ?? capitalize(provider);

  return (
    <Button
      {...props}
      className={cn(
        'flex justify-start font-[400] space-x-2',
        hasCredentialsProvider ? 'justify-center items-center flex-1' : 'w-full',
      )}
      onClick={onSignIn}
      title={oAuthLabel}
      variant="outline"
    >
      <Icon
        className={cn(
          !hasCredentialsProvider && 'mr-4',
          provider === Provider.SLACK && !hasCredentialsProvider && 'ml-0.5 mr-[1.125rem]',
        )}
        size={20}
      />
      {!hasCredentialsProvider && t('continueWith', { provider: oAuthLabel })}
    </Button>
  );
};
