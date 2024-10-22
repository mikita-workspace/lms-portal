import { Metadata } from 'next';

import { MarkdownText } from '@/components/common/markdown-text';
import { getLegalsDocument } from '@/lib/legals';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Educational portal',
};

const TermsAndConditionsPage = async () => {
  const content = getLegalsDocument('terms');

  return (
    <div className="p-6 flex flex-col mb-6">
      <div className="w-full flex justify-center">
        <MarkdownText className="max-w-screen-md" text={content} />
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
