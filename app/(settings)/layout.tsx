import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getGlobalProgress } from '@/actions/db/get-global-progress';

import { NavBar } from '../../components/navbar/navbar';
import { SideBar } from '../../components/sidebar/sidebar';

type SettingsLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const SettingsLayout = async ({ children }: SettingsLayoutProps) => {
  const user = await getCurrentUser();
  const globalProgress = await getGlobalProgress(user?.userId);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <div className="h-[80px] inset-y-0 w-full z-[50] fixed">
          <NavBar globalProgress={globalProgress} />
        </div>
        <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-[48]">
          <SideBar />
        </div>
        <main className="md:pl-64 pt-[80px] h-full">{children}</main>
      </div>
    </div>
  );
};

export default SettingsLayout;
