import { Metadata } from 'next';

import { PrettyLoader } from '@/components/loaders/pretty-loader';

export const metadata: Metadata = {
  title: 'Loading...',
  description: 'Educational portal',
};

const RestrictedLoading = () => {
  return <PrettyLoader />;
};

export default RestrictedLoading;
