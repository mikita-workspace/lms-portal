'use client';

import { User } from '@prisma/client';
import { format } from 'date-fns';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { TextBadge } from '@/components/common/text-badge';
import { CreateOtpModal } from '@/components/modals/create-otp-modal';
import { Button } from '@/components/ui';
import { TIMESTAMP_TEMPLATE } from '@/constants/common';
import { fetcher } from '@/lib/fetcher';
import { cn } from '@/lib/utils';

type OtpFormProps = {
  initialData: User;
};

export const OtpForm = ({ initialData }: OtpFormProps) => {
  const isOtpEnabled = initialData?.otpSecret;
  const otpCreatedAt = initialData?.otpCreatedAt;

  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  const handleGenerate = async () => {
    try {
      setIsFetching(true);

      const otp = await fetcher.post('api/otp/generate', {
        responseType: 'json',
        body: { email: initialData.email },
      });

      setQrCode(otp.qr);
      setSecret(otp.secret);
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
      <div className="space-y-0.5">
        <div className="flex items-center space-x-2 mb-1.5">
          <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Enable 2FA
          </div>
          <TextBadge
            label={isOtpEnabled ? 'Enabled' : 'Disabled'}
            variant={isOtpEnabled ? 'green' : 'red'}
          />
        </div>
        <div className="text-muted-foreground text-xs">
          <p className={cn(isOtpEnabled && 'mb-2')}>
            Two-factor authentication adds an additional layer of security to your account
          </p>
          {isOtpEnabled && otpCreatedAt && (
            <p>Added at {format(otpCreatedAt, TIMESTAMP_TEMPLATE)}</p>
          )}
        </div>
      </div>
      {!isOtpEnabled && (
        <CreateOtpModal qrCode={qrCode} secret={secret}>
          <Button variant="outline" onClick={handleGenerate} disabled={isFetching}>
            Enable
          </Button>
        </CreateOtpModal>
      )}
    </div>
  );
};
