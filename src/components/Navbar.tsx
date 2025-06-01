"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { BiArrowBack, BiMenu, BiX } from "react-icons/bi";
import { BsHouseFill, BsBellFill, BsSearch, BsTwitter } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";

import Avatar from "./Avatar";
import useCurrentUser from "@/hooks/useCurrentUser";
import useTweetModal from "@/hooks/useTweetModal";
import useLoginModal from "@/hooks/useLoginModal";

interface NavbarProps {
  label?: string;
  showBackArrow?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ label, showBackArrow }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { data: currentUser } = useCurrentUser();
  const tweetModal = useTweetModal();
  const loginModal = useLoginModal();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleBack = () => {
    router.back();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (href: string) => {
    if (!session && (href === '/notifications' || href.startsWith('/users/'))) {
      loginModal.onOpen();
      return;
    }
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  const handleTweet = () => {
    if (!session) {
      loginModal.onOpen();
      return;
    }
    tweetModal.onOpen();
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    signOut();
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    {
      icon: BsHouseFill,
      label: "Home",
      href: "/",
      active: pathname === "/",
    },
    {
      icon: BsSearch,
      label: "Search",
      href: "/search",
      active: pathname === "/search",
    },
    {
      icon: BsBellFill,
      label: "Notifications",
      href: "/notifications",
      active: pathname === "/notifications",
      auth: true,
      alert: currentUser?.hasNotification,
    },
    {
      icon: FaUser,
      label: "Profile",
      href: `/users/${currentUser?.id}`,
      active: pathname === `/users/${currentUser?.id}`,
      auth: true,
    },
  ];

  return (
    <>
      {/* Desktop Header */}
      <div className="hidden md:block border-b border-neutral-800 bg-black/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            {showBackArrow && (
              <button
                onClick={handleBack}
                className="p-2 rounded-full hover:bg-neutral-800 transition-colors"
              >
                <BiArrowBack className="text-white" size={20} />
              </button>
            )}
            <h1 className="text-white text-xl font-bold">
              {label || "Twitter"}
            </h1>
          </div>
          
          {session && (
            <div className="flex items-center gap-4">
              <button
                onClick={handleTweet}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-full font-semibold transition-colors"
              >
                Tweet
              </button>
              <Avatar
                userId={currentUser?.id || ''}
                profileImage={currentUser?.profileImage || null}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden border-b border-neutral-800 bg-black/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {showBackArrow ? (
              <button
                onClick={handleBack}
                className="p-2 rounded-full hover:bg-neutral-800 transition-colors"
              >
                <BiArrowBack className="text-white" size={20} />
              </button>
            ) : (
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-full hover:bg-neutral-800 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <BiX className="text-white" size={24} />
                ) : (
                  <BiMenu className="text-white" size={24} />
                )}
              </button>
            )}
            
            {!showBackArrow && (
              <div className="flex items-center gap-2">
                <BsTwitter className="text-sky-500" size={24} />
                <span className="text-white font-bold text-lg">Twitter</span>
              </div>
            )}
            
            {showBackArrow && (
              <h1 className="text-white text-lg font-bold">
                {label}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-3">
            {session && (
              <>
                <button
                  onClick={handleTweet}
                  className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold transition-colors"
                >
                  Tweet
                </button>
                <Avatar
                  userId={currentUser?.id || ''}
                  profileImage={currentUser?.profileImage || null}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={toggleMobileMenu}>
          <div 
            className="absolute left-0 top-0 h-full w-64 bg-black border-r border-neutral-800 transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="p-4 border-b border-neutral-800">
                <div className="flex items-center gap-3">
                  <BsTwitter className="text-sky-500" size={24} />
                  <span className="text-white font-bold text-lg">Twitter</span>
                </div>
              </div>

              {/* User Info */}
              {session && currentUser && (
                <div className="p-4 border-b border-neutral-800">
                  <div className="flex items-center gap-3">
                    <Avatar
                      userId={currentUser.id}
                      profileImage={currentUser.profileImage}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold truncate">
                        {currentUser.name || currentUser.username || 'User'}
                      </div>
                      <div className="text-neutral-400 text-sm truncate">
                        @{currentUser.username || 'username'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Items */}
              <div className="flex-1 py-4">
                {navigationItems.map((item) => {
                  if (item.auth && !session) return null;
                  
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleNavigation(item.href)}
                      className={`w-full flex items-center gap-4 px-4 py-3 hover:bg-neutral-900 transition-colors ${
                        item.active ? 'text-sky-500' : 'text-white'
                      }`}
                    >
                      <div className="relative">
                        <item.icon size={24} />
                        {item.alert && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                        )}
                      </div>
                      <span className="text-lg">{item.label}</span>
                    </button>
                  );
                })}

                {/* Tweet Button */}
                <div className="px-4 mt-6">
                  <button
                    onClick={handleTweet}
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-full font-semibold transition-colors"
                  >
                    Tweet
                  </button>
                </div>
              </div>

              {/* Logout Button */}
              {session && (
                <div className="p-4 border-t border-neutral-800">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-2 py-3 text-white hover:bg-neutral-900 rounded-lg transition-colors"
                  >
                    <HiOutlineLogout size={24} />
                    <span className="text-lg">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation for Mobile */}
      {isMobile && session && !isMobileMenuOpen && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-neutral-800 z-30">
          <div className="flex items-center justify-around py-2">
            {navigationItems.slice(0, 4).map((item) => {
              if (item.auth && !session) return null;
              
              return (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                    item.active 
                      ? 'text-sky-500' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="relative">
                    <item.icon size={20} />
                    {item.alert && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </div>
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
