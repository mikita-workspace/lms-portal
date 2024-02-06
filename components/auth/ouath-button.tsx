'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

import { Provider } from '@/constants/auth';
import { capitalize } from '@/lib/utils';

import { Button, ButtonProps } from '../ui';

type OAuthButton = {
  provider: Provider;
  setIsDisabled?: (value: boolean) => void;
} & ButtonProps;

export const OAuthButton = ({ provider, setIsDisabled, ...props }: OAuthButton) => {
  const searchParams = useSearchParams();

  const handleSignIn = async () => {
    setIsDisabled?.(true);

    await signIn(provider, { callbackUrl: searchParams.get('callbackUrl') ?? '/' });
  };

  return (
    <Button
      {...props}
      className="w-full flex justify-start font-[400]"
      variant="outline"
      onClick={handleSignIn}
    >
      <Image
        className="h-5 w-5 mr-4"
        src={`/assets/${provider}.svg`}
        alt={provider}
        width="1"
        height="1"
      />
      {`Continue with ${capitalize(provider)}`}
    </Button>
  );
};
