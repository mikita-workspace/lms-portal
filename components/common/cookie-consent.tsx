'use client';
import { hasCookie, setCookie } from 'cookies-next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Button } from '../ui';

export const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(true);

  useEffect(() => {
    setShowConsent(hasCookie('cookie-consent'));
  }, []);

  const handleAcceptCookie = () => {
    setShowConsent(true);
    setCookie('cookie-consent', 'true', {});
  };

  if (showConsent) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between p-6 bg-background border-t">
        <span className="text-dark text-sm font-medium mr-16">
          We use cookies to enhance the user experience. By using our website, you consent to all
          cookies in accordance with our{' '}
          <Link href="#" target="_blank" className="hover:underline font-bold">
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
