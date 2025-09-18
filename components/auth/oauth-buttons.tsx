'use client';

import { MoreHorizontal } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { MAX_OAUTH_IN_ROW, OAUTH_LABELS, Provider } from '@/constants/auth';
import SmartDropDownMenu from '@/hoc/smart-drop-down-menu';
import { capitalize, cn } from '@/lib/utils';

import { Button } from '../ui';
import { authIcons } from './auth-icons';
import { OAuthButton } from './ouath-button';

type OAuthButtonsProps = {
  isDisabledButtons?: boolean;
  providers: Record<string, boolean>;
  setIsDisabledButtons: (value: boolean) => void;
};

export const OAuthButtons = ({
  isDisabledButtons,
  providers,
  setIsDisabledButtons,
}: OAuthButtonsProps) => {
  const t = useTranslations('auth-form');

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const isPreviewCoursePage = pathname.startsWith('/preview-course');

  const activeProviders = Object.values(Provider).reduce<Provider[]>((acc, provider) => {
    const isActiveProvider = providers[provider];

    if (provider !== Provider.CREDENTIALS && isActiveProvider) {
      acc.push(provider);
    }

    return acc;
  }, []);

  const [headProviders, tailProviders] = useMemo(() => {
    const showDropDown = activeProviders.length > MAX_OAUTH_IN_ROW;

    if (showDropDown) {
      return [
        activeProviders.slice(0, MAX_OAUTH_IN_ROW - 1),
        activeProviders.slice(MAX_OAUTH_IN_ROW - 1),
      ];
    }

    return [activeProviders, []];
  }, [activeProviders]);

  const callbackUrl = useMemo(() => {
    if (isPreviewCoursePage) {
      return pathname;
    }

    return searchParams.get('callbackUrl') ?? '/';
  }, [isPreviewCoursePage, pathname, searchParams]);

  const handleSignIn = async (provider: Provider) => {
    setIsDisabledButtons?.(true);

    await signIn(provider, { callbackUrl });
  };

  const body = tailProviders.map((provider) => {
    const Icon = authIcons[provider];
    const oAuthLabel = OAUTH_LABELS[provider] ?? capitalize(provider);

    return {
      callback: () => handleSignIn(provider),
      title: t('continueWith', { provider: oAuthLabel }),
      icon: () => (
        <Icon
          className={cn('mr-4', provider === Provider.SLACK && 'ml-0.5 mr-[1.125rem]')}
          size={20}
        />
      ),
    };
  });

  return (
    <div className="space-y-2 w-full flex items-end justify-between space-x-2 mt-0">
      {headProviders.map((provider) => (
        <OAuthButton
          disabled={isDisabledButtons}
          key={provider}
          onSignIn={() => handleSignIn(provider)}
          provider={provider as Provider}
        />
      ))}
      {Boolean(tailProviders.length) && (
        <SmartDropDownMenu body={body}>
          <Button
            className="flex font-[400] space-x-0 justify-center items-center flex-1"
            disabled={isDisabledButtons}
            variant="outline"
          >
            <MoreHorizontal className="w-6 h-6" />
          </Button>
        </SmartDropDownMenu>
      )}
    </div>
  );
};
