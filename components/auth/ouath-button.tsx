'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useMemo } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { Provider } from '@/constants/auth';
import { capitalize } from '@/lib/utils';

import { Button, ButtonProps } from '../ui';

const iconMap = {
  [Provider.GITHUB]: FaGithub,
  [Provider.GOOGLE]: FcGoogle,
};

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

  const Icon = iconMap[provider];

  return (
    <Button
      {...props}
      className="w-full flex justify-start font-[400] space-x-2"
      variant="outline"
      onClick={handleSignIn}
    >
      <Icon className="mr-4" size={20} />
      {`Continue with ${capitalize(provider)}`}
    </Button>
  );
};
