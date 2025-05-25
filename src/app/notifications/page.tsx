"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { BsBellFill, BsHeartFill, BsPersonFill } from 'react-icons/bs';
import { FaRetweet } from 'react-icons/fa';

import Header from '@/components/Header';
import useCurrentUser from '@/hooks/useCurrentUser';
import useNotifications from '@/hooks/useNotifications';

const NotificationsPage = () => {
  const router = useRouter();
  const { status } = useSession();
  const { data: currentUser } = useCurrentUser();
  const { data: notifications = [], isLoading, mutate } = useNotifications(currentUser?.id);
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }
    
    const markAsRead = async () => {
      try {        if (currentUser?.id) {
          // Mark notifications as read
          await fetch('/api/notifications', {
            method: 'PATCH'
          });
          
          mutate();
        }
      } catch (error) {
        console.error('Error marking notifications as read:', error);
      }    };
      markAsRead();
  }, [router, status, currentUser?.id, mutate]);
    if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen">
        <Header label="Notifications" showBackArrow />
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
            <p className="text-neutral-400 text-sm">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }
    return (
    <div className="min-h-screen">
      <Header label="Notifications" showBackArrow />
      <div className="flex flex-col">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="bg-neutral-800 rounded-full p-8 mb-6">
              <BsBellFill size={48} className="text-neutral-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No notifications yet</h3>
            <p className="text-neutral-400 text-center max-w-sm">
              When someone likes, comments, or follows you, you'll see it here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-800">
            {notifications.map((notification: Record<string, any>) => {
              const getNotificationIcon = () => {
                if (notification.body.includes('liked')) {
                  return <BsHeartFill className="text-red-500" size={20} />;
                } else if (notification.body.includes('commented')) {
                  return <BsBellFill className="text-sky-500" size={20} />;
                } else if (notification.body.includes('followed')) {
                  return <BsPersonFill className="text-green-500" size={20} />;
                } else if (notification.body.includes('retweeted')) {
                  return <FaRetweet className="text-green-400" size={20} />;
                }
                return <BsBellFill className="text-sky-500" size={20} />;
              };

              const getTimeAgo = (date: string) => {
                const now = new Date();
                const past = new Date(date);
                const diffMs = now.getTime() - past.getTime();
                const diffMins = Math.floor(diffMs / 60000);
                const diffHours = Math.floor(diffMs / 3600000);
                const diffDays = Math.floor(diffMs / 86400000);

                if (diffMins < 1) return 'Just now';
                if (diffMins < 60) return `${diffMins}m`;
                if (diffHours < 24) return `${diffHours}h`;
                if (diffDays < 7) return `${diffDays}d`;
                return past.toLocaleDateString();
              };

              return (
                <div 
                  key={notification.id} 
                  className="
                    flex 
                    flex-row 
                    items-start 
                    p-4 
                    sm:p-6 
                    gap-3 
                    sm:gap-4 
                    hover:bg-neutral-900
                    transition-colors
                    duration-200
                    cursor-pointer
                  "
                >
                  <div className="
                    flex-shrink-0 
                    bg-neutral-800 
                    rounded-full 
                    p-2.5 
                    sm:p-3
                  ">
                    {getNotificationIcon()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="
                      text-white 
                      text-sm 
                      sm:text-base 
                      leading-relaxed
                      mb-1
                    ">
                      {notification.body}
                    </p>
                    <p className="
                      text-neutral-500 
                      text-xs 
                      sm:text-sm
                      flex
                      items-center
                      gap-1
                    ">
                      <span>{getTimeAgo(notification.createdAt)}</span>
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="
                      w-2 
                      h-2 
                      bg-sky-500 
                      rounded-full
                      opacity-75
                    "></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
