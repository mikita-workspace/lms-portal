'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { PRIVACY_POLICY_URL, TERMS_AND_CONDITIONS_URL } from '@/constants/common';

export const TermsAndPrivacy = () => {
  const t = useTranslations();

  const termsUrl = (
    <Link target="_blank" className="text-primary hover:underline" href={TERMS_AND_CONDITIONS_URL}>
      {t('footer.termsAndConditions')}
    </Link>
  );

  const privacyUrl = (
    <Link target="_blank" className="text-primary hover:underline" href={PRIVACY_POLICY_URL}>
      {t('footer.privacyPolicy')}
    </Link>
  );

  return (
    <p className="text-xs text-muted-foreground mt-4">
      {t('footer.creatingAccount')} {termsUrl} {t('footer.and')} {privacyUrl}.
    </p>
  );
};
