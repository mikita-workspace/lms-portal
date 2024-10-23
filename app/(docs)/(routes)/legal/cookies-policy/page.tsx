import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { MarkdownText } from '@/components/common/markdown-text';

export const metadata: Metadata = {
  title: 'Cookies Policy',
  description: 'Educational portal',
};

const CookiesPolicyPage = async () => {
  const t = await getTranslations('docs');

  const res = await fetch(
    'https://raw.githubusercontent.com/mikita-workspace/lms-portal/main/docs/cookies-policy.md',
  );
  const content = await res.text();

  return (
    <div className="p-6 flex flex-col mb-6">
      <div className="w-full flex flex-col items-center">
        <Link
          className="flex items-center text-sm hover:opacity-75 transition duration-300 mb-6 self-start"
          href={'/'}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('backNav')}
        </Link>
        <MarkdownText className="max-w-screen-md" text={content} />
      </div>
    </div>
  );
};

export default CookiesPolicyPage;
