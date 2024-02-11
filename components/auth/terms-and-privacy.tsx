'use client';

import Link from 'next/link';

import { PRIVACY_POLICY_URL, TERMS_AND_CONDITIONS_URL } from '@/constants/common';

export const TermsAndPrivacy = () => {
  const termsUrl = (
    <Link target="_blank" className="text-primary hover:underline" href={TERMS_AND_CONDITIONS_URL}>
      Terms and Conditions
    </Link>
  );

  const privacyUrl = (
    <Link target="_blank" className="text-primary hover:underline" href={PRIVACY_POLICY_URL}>
      Privacy Policy
    </Link>
  );

  return (
    <p className="text-xs text-muted-foreground mt-4">
      {' '}
      By creating an account, you agree to our {termsUrl} and {privacyUrl}.
    </p>
  );
};
