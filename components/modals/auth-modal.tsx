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

import { OAuthButton } from '../auth/ouath-button';
import { TermsAndPrivacy } from '../auth/terms-and-privacy';

type AuthModalProps = {
  children: React.ReactNode;
  ignore?: boolean;
};

export const AuthModal = ({ children, ignore = false }: AuthModalProps) => {
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
            {Object.values(Provider).map((provider) => (
              <OAuthButton
                key={provider}
                disabled={isDisabledButtons}
                provider={provider}
                setIsDisabled={setIsDisabledButtons}
              />
            ))}
          </div>
        </Suspense>
        <DialogFooter>
          <TermsAndPrivacy />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
