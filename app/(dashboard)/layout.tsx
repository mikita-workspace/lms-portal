import { Footer } from './_components/footer/footer';
import { NavBar } from './_components/navbar/navbar';
import { SideBar } from './_components/sidebar/sidebar';

type DashboardLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <div className="h-[80px] inset-y-0 w-full z-[50] fixed">
          <NavBar />
        </div>
        <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-[48]">
          <SideBar />
        </div>
        <main className="md:pl-64 pt-[80px] h-full">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
