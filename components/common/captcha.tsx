'use client';

import { SmartCaptcha } from '@yandex/smart-captcha';
import { useState } from 'react';

export const Captcha = () => {
  const [, setToken] = useState('');

  return (
    <SmartCaptcha
      sitekey={'ysc1_pi99MCqNmUapQ7tpdtmv8UtvyQ4oGHrMUF9wpgBDc6ac94ae' as string}
      onSuccess={setToken}
    />
  );
};
