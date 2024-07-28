import { Smartphone } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import withCompanyLabel from '@/hoc/with-company-label';

import { OtpVerify } from './_components/otp-verify';

type OtpVerificationPageProps = {
  searchParams: { code: string };
};

const OtpVerificationPage = ({ searchParams: { code } }: OtpVerificationPageProps) => {
  return (
    <div className="relative h-full flex gap-y-4 items-center w-full">
      <div className="flex items-center gap-y-4 flex-col w-full text-muted-foreground px-2">
        <Smartphone className="h-10 w-10" />
        <h1 className="text-xl md:text-3xl font-semibold">2FA Verification</h1>
        <p className="text-sm md:text-lg text-center">Please enter the OTP code below.</p>
        <div className="flex flex-col gap-y-4 items-center">
          <OtpVerify callbackUrl="/" secret="test" />
          <Link href="/">
            <Button variant="secondary">Go back</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default withCompanyLabel(OtpVerificationPage);
