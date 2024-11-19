import { Metadata } from 'next';

import { getAppDocs } from '@/actions/docs/get-app-docs';
import { MarkdownText } from '@/components/common/markdown-text';

export const metadata: Metadata = {
  title: 'Cookies Policy',
  description: 'Educational portal',
};

const CookiesPolicyPage = async () => {
  const content = await getAppDocs('cookies-policy');

  return (
    <div className="p-6 flex flex-col mb-6">
      <div className="w-full flex flex-col items-center">
        <MarkdownText className="max-w-screen-md" text={content} />
      </div>
    </div>
  );
};

export default CookiesPolicyPage;
