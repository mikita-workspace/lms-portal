'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export const TermsAndPrivacy = () => {
  const t = useTranslations('footer');

  const termsUrl = (
    <Link target="_blank" className="text-primary hover:underline" href="docs/terms">
      {t('legal.termsAndConditions')}
    </Link>
  );

  const privacyUrl = (
    <Link target="_blank" className="text-primary hover:underline" href="docs/privacy-policy">
      {t('legal.privacyPolices')}
    </Link>
  );

  return (
    <p className="text-xs text-muted-foreground text-center">
      {t('creatingAccount')} {termsUrl} {t('and')} {privacyUrl}.
    </p>
  );
};
