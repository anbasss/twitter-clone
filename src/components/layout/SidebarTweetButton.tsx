"use client";

import { FaFeather } from "react-icons/fa";
import { useCallback } from "react";
import useTweetModal from "@/hooks/useTweetModal";

const SidebarTweetButton = () => {
  const tweetModal = useTweetModal();

  const onClick = useCallback(() => {
    tweetModal.onOpen();
  }, [tweetModal]);
  return (
    <div onClick={onClick} className="mt-4 lg:mt-6">
      {/* Mobile version */}
      <div
        className="
          lg:hidden
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
          bg-sky-500
          hover:bg-sky-600
          transition-all
          duration-200
          cursor-pointer
          shadow-lg
          hover:shadow-xl
          hover:scale-105
        "
      >
        <FaFeather size={20} color="white" className="sm:w-6 sm:h-6" />
      </div>
      
      {/* Desktop version */}
      <div
        className="
          hidden
          lg:block
          px-6
          py-3
          rounded-full
          bg-sky-500
          hover:bg-sky-600
          cursor-pointer
          transition-all
          duration-200
          shadow-lg
          hover:shadow-xl
          hover:scale-105
          w-full
        "
      >
        <p className="text-center font-semibold text-white text-lg">
          Post
        </p>
      </div>
    </div>
  );
};

export default SidebarTweetButton;
