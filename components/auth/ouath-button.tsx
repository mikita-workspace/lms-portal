'use client';

import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useMemo } from 'react';

import { Provider } from '@/constants/auth';
import { capitalize, cn } from '@/lib/utils';

import { Button, ButtonProps } from '../ui';

type OAuthButton = {
  provider: Provider;
  setIsDisabled?: (value: boolean) => void;
} & ButtonProps;

export const OAuthButton = ({ provider, setIsDisabled, ...props }: OAuthButton) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const isLandingCoursePage = pathname.startsWith('/landing-course');

  const callbackUrl = useMemo(() => {
    if (isLandingCoursePage) {
      return pathname;
    }

    return searchParams.get('callbackUrl') ?? '/';
  }, [isLandingCoursePage, pathname, searchParams]);

  const handleSignIn = async () => {
    setIsDisabled?.(true);

    await signIn(provider, { callbackUrl });
  };

  return (
    <Button
      {...props}
      className="w-full flex justify-start font-[400]"
      variant="outline"
      onClick={handleSignIn}
    >
      <Image
        className={cn('h-5 w-5 mr-4', provider === Provider.GITHUB && 'dark:invert')}
        src={`/assets/${provider}.svg`}
        alt={provider}
        width="1"
        height="1"
      />
      {`Continue with ${capitalize(provider)}`}
    </Button>
  );
};
