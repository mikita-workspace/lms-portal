'use client';

import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui';
import { OTP_LENGTH } from '@/constants/otp';
import { useDebounce } from '@/hooks/use-debounce';
import { useSearchLineParams } from '@/hooks/use-search-params';

export const OtpCode = () => {
  const [value, setValue] = useState('');

  const debouncedValue = useDebounce(value);
  const searchParams = useSearchParams();

  const code = searchParams.get('code');

  useSearchLineParams({ otp: debouncedValue, code });

  return (
    <InputOTP
      maxLength={OTP_LENGTH}
      onChange={(value) => setValue(value)}
      pattern={REGEXP_ONLY_DIGITS}
      value={value}
    >
      <InputOTPGroup>
        {[...Array(OTP_LENGTH).keys()].map((_, index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
};
