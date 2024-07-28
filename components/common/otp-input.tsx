'use client';

import { REGEXP_ONLY_DIGITS } from 'input-otp';

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui';
import { OTP_LENGTH } from '@/constants/otp';

type OtpInputProps = {
  errorMessage?: string;
  setToken: (value: string) => void;
};

export const OtpInput = ({ errorMessage = '', setToken }: OtpInputProps) => {
  return (
    <div>
      <InputOTP
        maxLength={OTP_LENGTH}
        onChange={(value) => setToken(value)}
        pattern={REGEXP_ONLY_DIGITS}
      >
        <InputOTPGroup>
          {[...Array(OTP_LENGTH).keys()].map((_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {Boolean(errorMessage) && <p className="text-xs text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
};
