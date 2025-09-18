import { Metadata } from 'next';

import { getAppDocs } from '@/actions/docs/get-app-docs';
import { MarkdownText } from '@/components/common/markdown-text';
import { PLATFORM_DESCRIPTION } from '@/constants/common';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: PLATFORM_DESCRIPTION,
};

const PrivacyPolicyPage = async () => {
  const content = await getAppDocs('privacy-policy');

  return (
    <div className="p-6 flex flex-col mb-6">
      <div className="w-full flex flex-col items-center">
        <MarkdownText className="max-w-screen-md" text={content} />
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
