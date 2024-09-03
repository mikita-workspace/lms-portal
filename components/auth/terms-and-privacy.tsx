'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export const TermsAndPrivacy = () => {
  const t = useTranslations('footer');

  const termsUrl = (
    <Link
      target="_blank"
      className="text-primary hover:underline"
      href={process.env.NEXT_PUBLIC_TERMS_AND_CONDITIONS_URL as string}
    >
      {t('termsAndConditions')}
    </Link>
  );

  const privacyUrl = (
    <Link
      target="_blank"
      className="text-primary hover:underline"
      href={process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL as string}
    >
      {t('privacyPolices')}
    </Link>
  );

  return (
    <p className="text-xs text-muted-foreground mt-4">
      {t('creatingAccount')} {termsUrl} {t('and')} {privacyUrl}.
    </p>
  );
};
