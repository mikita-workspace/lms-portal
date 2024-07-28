'use client';

import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { TextBadge } from '@/components/common/text-badge';
import { Button } from '@/components/ui';
import { encrypt } from '@/lib/utils';

type TwoFaFormProps = {
  initialData: User;
};

export const TwoFaForm = ({ initialData }: TwoFaFormProps) => {
  const router = useRouter();

  const is2Fa = initialData?.is2mfa;

  const handleOnClick = async () => {
    try {
      if (is2Fa) {
        toast.success('Visibility updated');
        router.refresh();
      } else {
        router.push(`/2FA?code=${encrypt({ email: initialData.email }, 'test')}`);
      }
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  return (
    <div className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4">
      <div className="space-y-0.5">
        <div className="flex items-center space-x-2 mb-1.5">
          <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Enable 2FA
          </div>
          <TextBadge label={is2Fa ? 'Enabled' : 'Disabled'} variant={is2Fa ? 'green' : 'red'} />
        </div>
        <div className="text-muted-foreground text-xs">
          Two-factor authentication adds an additional layer of security to your account
        </div>
      </div>
      <Button variant="outline" onClick={handleOnClick}>
        {is2Fa ? 'Disable' : 'Enable'}
      </Button>
    </div>
  );
};
