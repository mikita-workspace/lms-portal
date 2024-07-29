'use client';

import { REGEXP_ONLY_DIGITS } from 'input-otp';

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui';
import { OTP_LENGTH } from '@/constants/otp';
import { cn } from '@/lib/utils';

type OtpInputProps = {
  disabled?: boolean;
  errorMessage?: string;
  isSuccess?: boolean;
  setToken: (value: string) => void;
};

export const OtpInput = ({
  disabled = false,
  errorMessage = '',
  isSuccess = false,
  setToken,
}: OtpInputProps) => {
  return (
    <div>
      <InputOTP
        disabled={disabled}
        maxLength={OTP_LENGTH}
        onChange={(value) => setToken(value)}
        pattern={REGEXP_ONLY_DIGITS}
      >
        <InputOTPGroup>
          {[...Array(OTP_LENGTH).keys()].map((_, index) => (
            <InputOTPSlot
              key={index}
              index={index}
              className={cn(errorMessage && 'border-red-500', isSuccess && 'border-green-500')}
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {Boolean(errorMessage) && <p className="text-xs text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
};
