"use client";

import Sidebar from "./Sidebar";
import FollowBar from "./FollowBar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black">
      <div className="container h-full mx-auto xl:px-30 max-w-6xl">
        <div className="grid grid-cols-4 h-full">
          <Sidebar />
          <div className="
            col-span-3 
            lg:col-span-2 
            border-x-[1px] 
            border-neutral-800
            min-h-screen
          ">
            {children}
          </div>
          <div className="col-span-1 hidden lg:block">
            <FollowBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
