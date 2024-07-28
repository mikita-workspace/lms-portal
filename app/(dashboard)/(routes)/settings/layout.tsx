import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Educational portal',
};

type SettingsLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const SettingsLayout = async ({ children }: SettingsLayoutProps) => {
  return <>{children}</>;
};

export default SettingsLayout;
