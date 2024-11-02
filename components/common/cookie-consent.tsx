'use client';

import { hasCookie, setCookie } from 'cookies-next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { ONE_YEAR_SEC } from '@/constants/common';
import { cn } from '@/lib/utils';

import { Button } from '../ui';

export const CookieConsent = () => {
  const t = useTranslations('cookie-consent');
  const pathname = usePathname();

  const [shownConsent, setShownConsent] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const isCookiesPolicyPage = pathname.startsWith('/docs/cookies-policy');

  useEffect(() => {
    const hasShownContent = hasCookie('cookie-consent');

    setShownConsent(hasShownContent || isCookiesPolicyPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const body = document.getElementsByTagName('body')[0];
    body?.setAttribute('style', isClosing || shownConsent ? 'overflow:auto' : 'overflow:hidden');
  }, [shownConsent, isClosing]);

  const handleAcceptCookie = () => {
    setIsClosing(true);
    setCookie('cookie-consent', 'true', { maxAge: ONE_YEAR_SEC });

    setTimeout(() => {
      setShownConsent(true);
    }, 1000);
  };

  if (shownConsent) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-1000 z-50',
        isClosing ? 'opacity-0' : 'opacity-100',
      )}
    >
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between p-6 bg-background border-t shadow-lg animate-cookie-consent-up">
        <span className="text-dark text-sm font-medium mr-16">
          {t('body')}{' '}
          <Link href="/docs/cookies-policy" target="_blank" className="hover:underline font-bold">
            {t('policy')}
          </Link>
          .
        </span>
        <Button size="lg" className="w-[150px]" variant="success" onClick={handleAcceptCookie}>
          {t('accept')}
        </Button>
      </div>
    </div>
  );
};
