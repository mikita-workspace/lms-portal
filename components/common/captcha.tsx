'use client';

import { SmartCaptcha, SmartCaptchaProps } from '@yandex/smart-captcha';

type CaptchaProps = { callback: (token: string | null) => void; locale: string };

export const Captcha = ({ callback, locale }: CaptchaProps) => {
  return (
    <SmartCaptcha
      language={locale as SmartCaptchaProps['language']}
      onSuccess={callback}
      sitekey={process.env.NEXT_PUBLIC_YD_CAPTCHA as string}
      webview
    />
  );
};
