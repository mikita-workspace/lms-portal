'use client';

import { hasCookie, setCookie } from 'cookies-next';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { ONE_HOUR_SEC } from '@/constants/common';

export const TestModeDeclaimer = () => {
  const t = useTranslations('footer');

  const [shownDeclaimer, setShownDeclaimer] = useState(true);

  useEffect(() => {
    const hasShownContent = hasCookie('test-mode-declaimer');

    setShownDeclaimer(hasShownContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAcceptDeclaimer = () => {
    setCookie('test-mode-declaimer', 'true', { maxAge: ONE_HOUR_SEC });
    setShownDeclaimer(true);
  };

  if (shownDeclaimer) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ delay: 0.5 }}
      className="fixed flex items-center justify-center w-full p-2 bg-orange-500 text-white font-semibold text-xs z-[100]"
    >
      <p>{t('testModeDeclaimer')}</p>
      <button onClick={handleAcceptDeclaimer} className="absolute right-2">
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};
