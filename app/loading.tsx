import { Metadata } from 'next';

import { PrettyLoader } from '@/components/loaders/pretty-loader';

export const metadata: Metadata = {
  title: 'Loading...',
  description: 'Educational portal',
};

const GlobalLoading = () => {
  return <PrettyLoader />;
};

export default GlobalLoading;
