'use client';

import { SmartCaptcha } from '@yandex/smart-captcha';

type CaptchaProps = { callback: (token: string | null) => void };

export const Captcha = ({ callback }: CaptchaProps) => {
  return (
    <SmartCaptcha
      language="en"
      onSuccess={callback}
      sitekey="ysc1_Mff0gcku68UrZdM7anNxqg2cTSM1HZqKKXLe8ibQd0d9bec1"
      webview
    />
  );
};
