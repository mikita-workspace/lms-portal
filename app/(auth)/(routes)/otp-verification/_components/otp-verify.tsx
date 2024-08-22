'use client';

import { signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { OtpInput } from '@/components/common/otp-input';
import { OTP_LENGTH } from '@/constants/otp';
import { useDebounce } from '@/hooks/use-debounce';
import { fetcher } from '@/lib/fetcher';

type OtpVerify = {
  callbackUrl: string;
  provider: string;
  secret: string;
  userId: string;
};

export const OtpVerify = ({ callbackUrl, provider, secret, userId }: OtpVerify) => {
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const debouncedValue = useDebounce(token);

  useEffect(() => {
    const verifyOtp = async () => {
      try {
        setIsFetching(true);

        const response = await fetcher.post('/api/otp/verify', {
          responseType: 'json',
          body: { token, secret, userId, isOtpVerify: true },
        });

        if (response.verified) {
          setIsSuccess(true);
          await signIn(provider, { callbackUrl, isAfterOtpPage: true });
        } else {
          setErrorMessage('Invalid OTP code');
        }
      } catch (error) {
        setErrorMessage('Something went wrong!');
      } finally {
        setIsFetching(false);
      }
    };

    if (debouncedValue.length === OTP_LENGTH) {
      verifyOtp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useEffect(() => {
    if (errorMessage.length > 0) {
      setErrorMessage('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <OtpInput
      disabled={isFetching || isSuccess}
      errorMessage={errorMessage}
      isSuccess={isSuccess}
      setToken={setToken}
    />
  );
};
