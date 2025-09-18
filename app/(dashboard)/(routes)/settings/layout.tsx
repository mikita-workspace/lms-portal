import { Metadata } from 'next';

import { PLATFORM_DESCRIPTION } from '@/constants/common';

export const metadata: Metadata = {
  title: 'Settings',
  description: PLATFORM_DESCRIPTION,
};

type SettingsLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const SettingsLayout = async ({ children }: SettingsLayoutProps) => {
  return <>{children}</>;
};

export default SettingsLayout;
