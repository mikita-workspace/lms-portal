import { LogIn, Smartphone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { OTP_LENGTH } from '@/constants/otp';
import withCompanyLabel from '@/hoc/with-company-label';

import { OtpCode } from './_components/otp-code';

type TwoMfaPageProps = {
  searchParams: { code: string; otp: string };
};

const TwoMfaPage = ({ searchParams: { code, otp } }: TwoMfaPageProps) => {
  const isDisabled = !otp?.length || otp?.length !== OTP_LENGTH;

  return (
    <div className="relative h-full flex gap-y-4 items-center w-full">
      <div className="flex items-center gap-y-4 flex-col w-full text-muted-foreground px-2">
        <Smartphone className="h-10 w-10" />
        <h1 className="text-xl md:text-3xl font-semibold">Enable 2FA Authentication</h1>
        <p className="text-sm md:text-lg text-center">
          You can use any authenticator app that supports Time-based, One Time Password (TOTP) such
          as the Google.
        </p>
        <div className="flex flex-col items-center mb-4">
          <div className="border w-40 h-40 my-4">
            {/* <Image
          src="https://miro.medium.com/v2/resize:fit:789/1*A9YcoX1YxBUsTg7p-P6GBQ.png"
          alt="qr-code"
          width="20"
          height="20"
        /> */}
          </div>
          <OtpCode />
        </div>
        <div className="flex gap-x-2">
          <Button disabled={isDisabled}>Enable</Button>
          <Link href="/">
            <Button variant="secondary">Cancel</Button>
          </Link>
        </div>
      </div>
      {/* <div className="absolute flex justify-center items-center mb-8 bottom-0 gap-x-1 w-full text-sm text-muted-foreground">
        Powered by
        <div className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-x-1">
          <div className="h-4 w-4">
            <Logo onlyLogoIcon isChat />
          </div>
          <span>Nova LMS</span>
        </div>
      </div> */}
    </div>
  );
};

export default withCompanyLabel(TwoMfaPage);
