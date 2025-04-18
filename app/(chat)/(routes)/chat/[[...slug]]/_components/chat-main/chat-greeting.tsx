'use client';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export const ChatGreeting = () => {
  const t = useTranslations('chat.body');

  return (
    <div className="mx-auto px-8 size-full flex flex-col justify-center mb-2">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
        className="text-2xl font-semibold"
      >
        {t('greeting')}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
        className="text-2xl text-zinc-500"
      >
        {t('title')}
      </motion.div>
    </div>
  );
};
