'use client';

import { SmartCaptcha } from '@yandex/smart-captcha';

type CaptchaProps = { callback: (token: string | null) => void };

export const Captcha = ({ callback }: CaptchaProps) => {
  return (
    <SmartCaptcha
      language="en"
      onSuccess={callback}
      sitekey={process.env.NEXT_PUBLIC_YD_CAPTCHA as string}
      webview
    />
  );
};
