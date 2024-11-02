import { Metadata } from 'next';

import { MarkdownText } from '@/components/common/markdown-text';
import { docs } from '@/constants/docs';
import { fetcher } from '@/lib/fetcher';

export const metadata: Metadata = {
  title: 'Cookies Policy',
  description: 'Educational portal',
};

const CookiesPolicyPage = async () => {
  const content = await fetcher.get(docs['cookies-policy'], { responseType: 'text' });

  return (
    <div className="p-6 flex flex-col mb-6">
      <div className="w-full flex flex-col items-center">
        <MarkdownText className="max-w-screen-md" text={content} />
      </div>
    </div>
  );
};

export default CookiesPolicyPage;
