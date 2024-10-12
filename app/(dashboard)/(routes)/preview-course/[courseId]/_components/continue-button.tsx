'use client';

import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui';

type ContinueButtonProps = {
  redirectUrl: string;
};

export const ContinueButton = ({ redirectUrl }: ContinueButtonProps) => {
  const t = useTranslations('courses.preview');

  const router = useRouter();

  return (
    <Button className="w-full truncate" onClick={() => router.push(redirectUrl)} variant="outline">
      {t('continue')}
      <ArrowRight className="w-4 h-4 ml-2" />
    </Button>
  );
};
