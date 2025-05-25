"use client";

import { useRouter } from "next/navigation";
import { BsTwitterX } from "react-icons/bs";

const SidebarLogo = () => {
  const router = useRouter();
  return (
    <div 
      onClick={() => router.push('/')}
      className="
        rounded-full
        h-12
        w-12
        sm:h-14
        sm:w-14
        p-3
        sm:p-4
        flex
        items-center
        justify-center
        hover:bg-blue-300
        hover:bg-opacity-10
        cursor-pointer
        transition-all
        duration-200
        mb-2
        lg:mb-4
      "
    >
      <BsTwitterX size={24} color="white" className="sm:w-7 sm:h-7" />
    </div>
  );
};

export default SidebarLogo;
