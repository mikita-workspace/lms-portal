'use client';

import { OAUTH_LABELS, Provider } from '@/constants/auth';
import { capitalize } from '@/lib/utils';

import { Button, ButtonProps } from '../ui';
import { authIcons } from './auth-icons';

type OAuthButton = {
  onSignIn: () => void;
  provider: Provider;
} & ButtonProps;

export const OAuthButton = ({ onSignIn, provider, ...props }: OAuthButton) => {
  const Icon = authIcons[provider];
  const oAuthLabel = OAUTH_LABELS[provider] ?? capitalize(provider);

  return (
    <Button
      {...props}
      className="flex font-[400] space-x-2 justify-center items-center flex-1"
      onClick={onSignIn}
      title={oAuthLabel}
      variant="outline"
    >
      <Icon size={20} />
    </Button>
  );
};
