import { LogIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
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
import { TERMS_AND_CONDITIONS_URL, PRIVACY_POLICY_URL } from '@/constants/common';

export const LoginButton = () => {
  const searchParams = useSearchParams();

  const [isDisabled, setIsDisabled] = useState(false);

  const handleSignIn = (provider: Provider) => async () => {
    setIsDisabled(true);

    await signIn(provider, { callbackUrl: searchParams.get('callbackUrl') ?? '/' });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <LogIn className="h-4 w-4 mr-2" />
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[445px] p-9">
        <DialogHeader>
          <DialogTitle className="text-lg font-[600]">Sign in</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            to continue to Nova LMS
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 w-full mt-4">
          <Button
            className="w-full flex justify-start font-[400]"
            variant="outline"
            disabled={isDisabled}
          >
            <Image
              className="h-5 w-5 mr-4"
              src="/assets/google.svg"
              alt="Google"
              width="1"
              height="1"
            />
            Continue with Google
          </Button>
          <Button
            className="w-full flex justify-start font-[400]"
            variant="outline"
            onClick={handleSignIn(Provider.GITHUB)}
            disabled={isDisabled}
          >
            <Image
              className="h-5 w-5 mr-4"
              src="/assets/github.svg"
              alt="Github"
              width="1"
              height="1"
            />
            Continue with GitHub
          </Button>
        </div>
        <DialogFooter>
          <p className="text-xs text-muted-foreground mt-4">
            By creating an account, you agree to our{' '}
            <Link
              target="_blank"
              className="text-primary hover:underline"
              href={TERMS_AND_CONDITIONS_URL}
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              target="_blank"
              className="text-primary hover:underline"
              href={PRIVACY_POLICY_URL}
            >
              Privacy Policy
            </Link>
            .
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};