'use client';

import { Suspense, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Provider } from '@/constants/auth';
import { useAppConfigStore } from '@/hooks/use-app-config-store';

import { OAuthButton } from '../auth/ouath-button';
import { TermsAndPrivacy } from '../auth/terms-and-privacy';

type AuthModalProps = {
  children: React.ReactNode;
  ignore?: boolean;
};

export const AuthModal = ({ children, ignore = false }: AuthModalProps) => {
  const { authFlow } = useAppConfigStore((state) => ({ authFlow: state.authFlow }));

  const [isDisabledButtons, setIsDisabledButtons] = useState(false);

  return ignore ? (
    children
  ) : (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[445px] p-9">
        <DialogHeader>
          <DialogTitle className="text-lg font-[600]">Sign in</DialogTitle>
          <DialogDescription className="text-base">to continue to Nova LMS</DialogDescription>
        </DialogHeader>
        <Suspense>
          <div className="space-y-2 w-full mt-4">
            {Object.keys(authFlow).map((provider) => {
              if (authFlow[provider]) {
                return (
                  <OAuthButton
                    key={provider}
                    disabled={isDisabledButtons}
                    provider={provider as Provider}
                    setIsDisabled={setIsDisabledButtons}
                  />
                );
              }

              return null;
            })}
          </div>
        </Suspense>
        <DialogFooter>
          <TermsAndPrivacy />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
