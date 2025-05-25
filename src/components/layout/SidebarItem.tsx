"use client";

import { useCallback } from "react";
import { IconType } from "react-icons";
import { useRouter } from "next/navigation";

interface SidebarItemProps {
  label: string;
  href?: string;
  icon: IconType;
  onClick?: () => void;
  auth?: boolean;
  alert?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  href,
  icon: Icon,
  onClick,
  auth,
  alert
}) => {
  const router = useRouter();
  
  const handleClick = useCallback(() => {
    if (onClick) {
      return onClick();
    }
    
    if (href) {
      router.push(href);
    }
  }, [onClick, router, href]);
  return (
    <div onClick={handleClick} className="flex flex-row items-center w-full">
      {/* Mobile version */}
      <div className="
        relative
        rounded-full
        h-12
        w-12
        sm:h-14
        sm:w-14
        flex
        items-center
        justify-center
        p-3
        sm:p-4
        hover:bg-slate-300
        hover:bg-opacity-10
        cursor-pointer
        transition-colors
        duration-200
        lg:hidden
      ">
        <Icon size={24} color="white" />
        {alert ? (
          <span className="
            absolute
            rounded-full
            bg-sky-500
            ring-2
            ring-black
            top-0
            right-0
            w-3
            h-3
            animate-pulse
          "/>
        ) : null}
      </div>
      
      {/* Desktop version */}
      <div className="
        relative
        hidden
        lg:flex
        items-center
        gap-4
        p-4
        rounded-full
        hover:bg-slate-300
        hover:bg-opacity-10
        cursor-pointer
        transition-all
        duration-200
        w-full
        group
      ">
        <Icon size={24} color="white" />
        <p className="
          hidden 
          lg:block 
          text-white 
          text-xl 
          font-medium
          group-hover:text-opacity-90
          transition-colors
          duration-200
        ">
          {label}
        </p>
        {alert ? (
          <span className="
            absolute
            rounded-full
            bg-sky-500
            ring-2
            ring-black
            top-3
            right-6
            w-3
            h-3
            animate-pulse
          "/>
        ) : null}
      </div>
    </div>
  );
};

export default SidebarItem;
