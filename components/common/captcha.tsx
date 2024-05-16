'use client';

import { SmartCaptcha } from '@yandex/smart-captcha';
import { useState } from 'react';

export const Captcha = () => {
  const [, setToken] = useState('');

  return (
    <SmartCaptcha
      sitekey={process.env.NEXT_PUBLIC_YCAPTCHA_SITEKEY as string}
      onSuccess={setToken}
    />
  );
};
