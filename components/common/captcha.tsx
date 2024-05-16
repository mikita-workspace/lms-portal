'use client';

import { SmartCaptcha } from '@yandex/smart-captcha';

type CaptchaProps = { callback: (token: string | null) => void };

export const Captcha = ({ callback }: CaptchaProps) => {
  console.log({
    NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
    NEXT_PUBLIC_YCAPTCHA_SITEKEY: process.env.NEXT_PUBLIC_CAPTCHA_KEY,
  });
  console.log(process.env);
  return (
    <SmartCaptcha
      language="en"
      onSuccess={callback}
      sitekey={process.env.NEXT_PUBLIC_YCAPTCHA_SITEKEY as string}
      webview
    />
  );
};
