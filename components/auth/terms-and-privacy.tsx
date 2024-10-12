'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export const TermsAndPrivacy = () => {
  const t = useTranslations('footer');

  const termsUrl = (
    <Link target="_blank" className="text-primary hover:underline" href="/terms-and-conditions">
      {t('termsAndConditions')}
    </Link>
  );

  const privacyUrl = (
    <Link target="_blank" className="text-primary hover:underline" href="privacy-policy">
      {t('privacyPolices')}
    </Link>
  );

  return (
    <p className="text-xs text-muted-foreground mt-4">
      {t('creatingAccount')} {termsUrl} {t('and')} {privacyUrl}.
    </p>
  );
};
