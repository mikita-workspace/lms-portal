'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export const TermsAndPrivacy = () => {
  const t = useTranslations('footer');

  const termsUrl = (
    <Link target="_blank" className="text-primary hover:underline" href="legal/terms">
      {t('legal.termsAndConditions')}
    </Link>
  );

  const privacyUrl = (
    <Link target="_blank" className="text-primary hover:underline" href="legal/privacy-policy">
      {t('legal.privacyPolices')}
    </Link>
  );

  return (
    <p className="text-xs text-muted-foreground mt-4">
      {t('creatingAccount')} {termsUrl} {t('and')} {privacyUrl}.
    </p>
  );
};
