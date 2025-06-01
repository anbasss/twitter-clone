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
          {/* Hide sidebar on mobile, show on desktop */}
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <div className="
            col-span-4
            md:col-span-3 
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
      {/* Add padding bottom for mobile bottom navigation */}
      <div className="pb-16 md:pb-0"></div>
    </div>
  );
};

export default Layout;
