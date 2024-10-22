import { Metadata } from 'next';

import { MarkdownText } from '@/components/common/markdown-text';
import { getLegalsDocument } from '@/lib/legals';

export const metadata: Metadata = {
  title: 'Cookies Policy',
  description: 'Educational portal',
};

const CookiesPolicyPage = async () => {
  const content = getLegalsDocument('cookies-policy');

  return (
    <div className="p-6 flex flex-col mb-6">
      <div className="w-full flex justify-center">
        <MarkdownText className="max-w-screen-md" text={content} />
      </div>
    </div>
  );
};

export default CookiesPolicyPage;
