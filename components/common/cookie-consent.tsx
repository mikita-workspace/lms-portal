'use client';

import { hasCookie, setCookie } from 'cookies-next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { COOKIE_POLICY_URL } from '@/constants/common';
import { cn } from '@/lib/utils';

import { Button } from '../ui';

export const CookieConsent = () => {
  const [shownConsent, setShownConsent] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const hasShownContent = hasCookie('cookie-consent');

    setShownConsent(hasShownContent);
  }, []);

  useEffect(() => {
    const body = document.getElementsByTagName('body')[0];
    body?.setAttribute('style', isClosing || shownConsent ? 'overflow:auto' : 'overflow:hidden');
  }, [shownConsent, isClosing]);

  const handleAcceptCookie = () => {
    setIsClosing(true);
    setCookie('cookie-consent', 'true', {});

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
          We use cookies to enhance the user experience. By using our website, you consent to all
          cookies in accordance with our{' '}
          <Link href={COOKIE_POLICY_URL} target="_blank" className="hover:underline font-bold">
            Cookie Policy
          </Link>
          .
        </span>
        <Button size="lg" className="w-[150px]" variant="success" onClick={handleAcceptCookie}>
          Accept
        </Button>
      </div>
    </div>
  );
};
