'use client';

import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useMemo } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { OAUTH_LABELS, Provider } from '@/constants/auth';
import { capitalize } from '@/lib/utils';

import { Button, ButtonProps } from '../ui';

const YandexIcon = () => (
  <Image className="mr-4" src="/assets/yandex.svg" alt="yandex" height={20} width={20} />
);

const SlackIcon = () => (
  <Image
    className="ml-0.5 mr-[1.125rem]"
    src="/assets/slack.svg"
    alt="slack"
    height={16}
    width={16}
  />
);
const iconMap = {
  [Provider.GITHUB]: FaGithub,
  [Provider.GOOGLE]: FcGoogle,
  [Provider.SLACK]: SlackIcon,
  [Provider.YANDEX]: YandexIcon,
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
  const oAuthLabel = OAUTH_LABELS[provider as keyof typeof OAUTH_LABELS] ?? capitalize(provider);

  return (
    <Button
      {...props}
      className="w-full flex justify-start font-[400] space-x-2"
      variant="outline"
      onClick={handleSignIn}
    >
      <Icon className="mr-4" size={20} />
      {`Continue with ${oAuthLabel}`}
    </Button>
  );
};
