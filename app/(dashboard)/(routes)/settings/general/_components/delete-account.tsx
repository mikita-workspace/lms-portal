'use client';

import { Flame } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { CaptchaInvisible } from '@/components/common/captcha-invisible';
import { DeleteAccountModal } from '@/components/modals/delete-account-modal';
import { Button } from '@/components/ui';

type DeleteAccountProps = { userId?: string; email?: string | null };

export const DeleteAccount = ({ userId, email }: DeleteAccountProps) => {
  const t = useTranslations('settings');
  const locale = useLocale();

  const [open, setOpen] = useState(false);

  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaVisible, setCaptchaVisible] = useState(false);

  const handleDelete = () => {
    if (captchaToken) {
      setOpen(true);
    } else {
      setCaptchaVisible(true);
    }
  };

  useEffect(() => {
    if (captchaToken) {
      setOpen(true);
    }
  }, [captchaToken]);

  return (
    <>
      <div className="flex items-center gap-x-2 mt-8">
        <Button variant="destructive" onClick={handleDelete}>
          <Flame className="h-4 w-4 mr-2" />
          {t('deleteAcc')}
        </Button>
      </div>
      {open && <DeleteAccountModal userId={userId} email={email} open={open} setOpen={setOpen} />}
      <CaptchaInvisible
        callback={(token) => {
          if (token) {
            setCaptchaToken(token);
          }
        }}
        locale={locale}
        setVisible={setCaptchaVisible}
        visible={captchaVisible}
      />
    </>
  );
};
