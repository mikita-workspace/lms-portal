import { PLATFORM_DESCRIPTION } from '@/constants/common';
import { Metadata } from 'next';

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
