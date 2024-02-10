'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
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

import { OAuthButton } from './ouath-button';
import { TermsAndPrivacy } from './terms-and-privacy';

type LoginButtonProps = {
  children: React.ReactNode;
};

export const LoginButton = ({ children }: LoginButtonProps) => {
  const [isDisabledButtons, setIsDisabledButtons] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[445px] p-9">
        <DialogHeader>
          <DialogTitle className="text-lg font-[600]">Sign in</DialogTitle>
          <DialogDescription className="text-base">to continue to Nova LMS</DialogDescription>
        </DialogHeader>
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
        <DialogFooter>
          <TermsAndPrivacy />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
