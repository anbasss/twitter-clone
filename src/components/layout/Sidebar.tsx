"use client";

import { useRouter } from "next/navigation";
import { BsHouseFill, BsBellFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { signOut, useSession } from "next-auth/react";

import SidebarLogo from "./SidebarLogo";
import SidebarItem from "./SidebarItem";
import SidebarTweetButton from "./SidebarTweetButton";

const Sidebar = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const items = [
    {
      icon: BsHouseFill,
      label: "Home",
      href: "/",
    },    {
      icon: BsBellFill,
      label: "Notifications",
      href: "/notifications",
      auth: true,
      alert: session?.user?.hasNotification || undefined,
    },
    {
      icon: FaUser,
      label: "Profile",
      href: `/users/${session?.user?.id}`,
      auth: true,
    },
  ];
  return (
    <div className="col-span-1 h-full pr-2 md:pr-4 lg:pr-6">
      <div className="flex flex-col items-end">
        <div className="space-y-2 lg:w-[230px] w-full flex flex-col items-center lg:items-start">
          <SidebarLogo />
          {items.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              auth={item.auth}
              alert={item.alert}
            />
          ))}
          {session && (
            <SidebarItem
              onClick={() => signOut()}
              icon={BiLogOut}
              label="Logout"
            />
          )}
          <SidebarTweetButton />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
