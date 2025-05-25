"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { BiArrowBack } from "react-icons/bi";

interface HeaderProps {
  label: string;
  showBackArrow?: boolean;
}

const Header: React.FC<HeaderProps> = ({ label, showBackArrow }) => {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);
  return (
    <div className="
      border-b-[1px] 
      border-neutral-800 
      p-4 
      sm:p-5 
      bg-black/80 
      backdrop-blur-md 
      sticky 
      top-0 
      z-10
    ">
      <div className="flex flex-row items-center gap-3 sm:gap-4">
        {showBackArrow && (
          <div className="
            p-2
            rounded-full
            hover:bg-neutral-800
            transition-colors
            duration-200
            cursor-pointer
          ">
            <BiArrowBack
              onClick={handleBack}
              color="white"
              size={20}
              className="
                hover:opacity-70
                transition-opacity
                duration-200
              "
            />
          </div>
        )}
        <h1 className="
          text-white 
          text-lg 
          sm:text-xl 
          font-bold 
          tracking-tight
        ">
          {label}
        </h1>
      </div>
    </div>
  );
};

export default Header;
