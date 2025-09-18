import { Metadata } from 'next';

import { PrettyLoader } from '@/components/loaders/pretty-loader';
import { PLATFORM_DESCRIPTION } from '@/constants/common';

export const metadata: Metadata = {
  title: 'Loading...',
  description: PLATFORM_DESCRIPTION,
};

const OtpVerificationLoading = () => {
  return <PrettyLoader />;
};

export default OtpVerificationLoading;
