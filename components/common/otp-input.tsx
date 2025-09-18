'use client';

import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Fragment } from 'react';

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui';
import { OTP_LENGTH } from '@/constants/otp';
import { cn } from '@/lib/utils';

type OtpInputProps = {
  className?: string;
  disabled?: boolean;
  errorMessage?: string;
  hasSeparator?: boolean;
  isSuccess?: boolean;
  setToken: (value: string) => void;
};

export const OtpInput = ({
  className,
  disabled = false,
  errorMessage = '',
  hasSeparator,
  isSuccess = false,
  setToken,
}: OtpInputProps) => {
  const slotClassname = cn(errorMessage && 'border-red-500', isSuccess && 'border-green-500');

  return (
    <div className={className}>
      <InputOTP
        disabled={disabled}
        maxLength={OTP_LENGTH}
        onChange={(value) => setToken(value)}
        pattern={REGEXP_ONLY_DIGITS}
      >
        {[...Array(OTP_LENGTH / 2).keys()].map((index) => (
          <Fragment key={index}>
            <InputOTPGroup>
              <InputOTPSlot index={index * 2} className={slotClassname} />
              <InputOTPSlot index={index * 2 + 1} className={slotClassname} />
            </InputOTPGroup>
            {hasSeparator && index !== OTP_LENGTH / 2 - 1 && <InputOTPSeparator />}
          </Fragment>
        ))}
      </InputOTP>
      {Boolean(errorMessage) && <p className="text-xs text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
};
