'use client';

import { SmartCaptcha, SmartCaptchaProps } from '@yandex/smart-captcha';

type CaptchaVisibleProps = { callback: (token: string | null) => void; locale: string };

export const CaptchaVisible = ({ callback, locale }: CaptchaVisibleProps) => {
  return (
    <SmartCaptcha
      language={locale as SmartCaptchaProps['language']}
      onSuccess={callback}
      sitekey={process.env.NEXT_PUBLIC_YD_CAPTCHA as string}
      test={process.env.NODE_ENV === 'development'}
      webview
    />
  );
};
