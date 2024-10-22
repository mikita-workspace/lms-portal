import { Metadata } from 'next';

import { MarkdownText } from '@/components/common/markdown-text';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Educational portal',
};

const TermsAndConditionsPage = async () => {
  const res = await fetch(
    'https://raw.githubusercontent.com/mikita-workspace/lms-portal/main/docs/terms.md',
  );
  const content = await res.text();
  return (
    <div className="p-6 flex flex-col mb-6">
      <div className="w-full flex justify-center">
        <MarkdownText className="max-w-screen-md" text={content} />
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
