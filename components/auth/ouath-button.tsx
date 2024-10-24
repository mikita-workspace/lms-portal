'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { OAUTH_LABELS, Provider } from '@/constants/auth';
import { capitalize, cn } from '@/lib/utils';

import { Button, ButtonProps } from '../ui';
import { authIcons } from './auth-icons';

type OAuthButton = {
  isCredentialsProvider?: boolean;
  provider: Provider;
  setIsDisabled?: (value: boolean) => void;
} & ButtonProps;

export const OAuthButton = ({
  isCredentialsProvider = false,
  provider,
  setIsDisabled,
  ...props
}: OAuthButton) => {
  const t = useTranslations('auth-form');

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const isPreviewCoursePage = pathname.startsWith('/preview-course');

  const callbackUrl = useMemo(() => {
    if (isPreviewCoursePage) {
      return pathname;
    }

    return searchParams.get('callbackUrl') ?? '/';
  }, [isPreviewCoursePage, pathname, searchParams]);

  const handleSignIn = async () => {
    setIsDisabled?.(true);

    await signIn(provider, { callbackUrl });
  };

  const Icon = authIcons[provider];
  const oAuthLabel = OAUTH_LABELS[provider as keyof typeof OAUTH_LABELS] ?? capitalize(provider);

  return (
    <Button
      {...props}
      className={cn(
        'flex justify-start font-[400] space-x-2',
        isCredentialsProvider ? 'justify-center items-center flex-1' : 'w-full',
      )}
      onClick={handleSignIn}
      title={oAuthLabel}
      variant="outline"
    >
      <Icon
        className={cn(
          !isCredentialsProvider && 'mr-4',
          provider === Provider.SLACK && !isCredentialsProvider && 'ml-0.5 mr-[1.125rem]',
        )}
        size={20}
      />
      {!isCredentialsProvider && t('continueWith', { provider: oAuthLabel })}
    </Button>
  );
};
