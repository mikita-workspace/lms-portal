import { Smartphone } from 'lucide-react';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { OTP_CALLBACK_URL_SECURE } from '@/constants/otp';
import withCompanyLabel from '@/hoc/with-company-label';
import { decrypt } from '@/lib/utils';

import { OtpVerify } from './_components/otp-verify';

export const metadata: Metadata = {
  title: 'OTP',
  description: 'Educational portal',
};

type OtpVerificationPageProps = {
  searchParams: { code: string };
};

const OtpVerificationPage = async ({ searchParams: { code } }: OtpVerificationPageProps) => {
  const t = await getTranslations('otpVerification');

  const otpInfo = JSON.parse(decrypt(decodeURIComponent(code), process.env.OTP_SECRET as string));
  const callbackUrl = cookies().get(OTP_CALLBACK_URL_SECURE)?.value ?? '/';

  return (
    <div className="relative h-full flex gap-y-4 items-center w-full">
      <div className="flex items-center gap-y-4 flex-col w-full text-muted-foreground px-2">
        <Smartphone className="h-10 w-10" />
        <h1 className="text-xl md:text-3xl font-semibold">{t('title')}</h1>
        <p className="text-sm md:text-lg text-center">{t('body')}</p>
        <div className="flex flex-col gap-y-4 items-center">
          <OtpVerify
            callbackUrl={callbackUrl}
            email={otpInfo.email}
            provider={otpInfo.provider}
            secret={otpInfo.secret}
            userId={otpInfo.userId}
          />
          <Link href={callbackUrl}>
            <Button variant="secondary">{t('goBack')}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default withCompanyLabel(OtpVerificationPage);
