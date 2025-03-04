'use client';

import Link from 'next/link';
import { useMediaQuery } from 'react-responsive';

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui';

type SmartDropDownMenu = {
  children: React.ReactNode;
  body: { callback?: () => void; icon?: React.ElementType; title: string; href?: string }[];
};

type MenuItemsProps = {
  body: SmartDropDownMenu['body'];
  isMobile?: boolean;
};

const MenuItems = ({ body, isMobile }: MenuItemsProps) =>
  body.map((item) => {
    const { callback, icon: Icon, title, href } = item;

    return (
      <>
        {isMobile && (
          <div key={title} className="hover:bg-muted hover:cursor-pointer p-4 rounded-md mt-2">
            {href && <Link href={href}>{title}</Link>}
            {callback && (
              <button
                onClick={callback}
                className="flex justify-start items-center font-[400] space-x-2"
              >
                {Icon && <Icon />}
                {title}
              </button>
            )}
          </div>
        )}
        {!isMobile && (
          <DropdownMenuItem key={item.title} className="hover:cursor-pointer p-2">
            {href && <Link href={href}>{title}</Link>}
            {callback && (
              <button
                onClick={callback}
                className="flex justify-start items-center font-[400] space-x-2"
              >
                {Icon && <Icon />}
                {title}
              </button>
            )}
          </DropdownMenuItem>
        )}
      </>
    );
  });

const SmartDropDownMenu = ({ body, children }: SmartDropDownMenu) => {
  const isMd = useMediaQuery({ maxWidth: 768 });

  return isMd ? (
    <Drawer>
      <DrawerTrigger asChild className="block hover:cursor-pointer">
        {children}
      </DrawerTrigger>
      <DrawerContent className="p-2 mb-2 gap-y-1 text-sm">
        <MenuItems body={body} isMobile />
      </DrawerContent>
    </Drawer>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="block hover:cursor-pointer">
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[260px] mr-4 mt-1 p-2">
        <MenuItems body={body} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SmartDropDownMenu;
