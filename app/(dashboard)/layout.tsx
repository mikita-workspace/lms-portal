import { NavBar } from './_components/navbar';
import { SideBar } from './_components/sidebar';

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="h-full">
      <div className="h-[80px] inset-y-0 w-full z-[49]">
        <NavBar />
      </div>
      <div className="hidden md:flex mt-[80px] h-full w-64 flex-col fixed inset-y-0 z-[48]">
        <SideBar />
      </div>
      <main className="md:pl-64 h-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
