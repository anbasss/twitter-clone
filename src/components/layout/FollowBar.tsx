"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "../Avatar";
import useFollow from "@/hooks/useFollow";

interface User {
  id: string;
  name: string | null;
  username: string | null;
  profileImage: string | null;
}

const FollowBar = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);useEffect(() => {
    const fetchUsers = async () => {
      try {        console.log('Fetching users...');
        const response = await fetch('/api/users', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Make sure data is an array before setting it
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error('Expected an array of users, got:', data);
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);
  if (isLoading) {
    return (
      <div className="px-4 py-4 hidden lg:block">
        <div className="bg-neutral-800/50 rounded-xl p-6 backdrop-blur-sm">
          <div className="animate-pulse">
            <div className="h-6 bg-neutral-700 rounded mb-4 w-32"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-neutral-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-neutral-700 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-neutral-700 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (users.length === 0) {
    return null;
  }
  return (
    <div className="px-4 py-4 hidden lg:block">
      <div className="bg-neutral-800/50 rounded-xl p-6 backdrop-blur-sm border border-neutral-700/50">
        <h2 className="text-white text-xl font-bold mb-4">Who to follow</h2>        <div className="flex flex-col gap-4">
          {users.map((user) => {
            const FollowButton = () => {
              const { isFollowing, toggleFollow } = useFollow(user.id);
              
              return (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFollow();
                  }}
                  className={`
                    px-4 
                    py-1.5 
                    rounded-full 
                    text-sm 
                    font-semibold 
                    transition-colors 
                    duration-200
                    opacity-0
                    group-hover:opacity-100
                    ${isFollowing 
                      ? 'bg-transparent border border-white text-white hover:bg-red-600 hover:border-red-600' 
                      : 'bg-white text-black hover:bg-neutral-200'
                    }
                  `}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              );
            };

            return (
              <div 
                key={user.id} 
                onClick={() => router.push(`/users/${user.id}`)}
                className="
                  flex 
                  flex-row 
                  items-center 
                  gap-3 
                  p-3 
                  rounded-lg 
                  hover:bg-neutral-700/30 
                  transition-colors 
                  duration-200 
                  cursor-pointer
                  group
                "
              >
                <Avatar userId={user.id} profileImage={user.profileImage} />
                <div className="flex flex-col flex-1 min-w-0">
                  <p className="
                    text-white 
                    font-semibold 
                    text-sm 
                    truncate
                    group-hover:text-sky-400
                    transition-colors
                    duration-200
                  ">
                    {user.name}
                  </p>
                  <p className="text-neutral-400 text-sm truncate">
                    @{user.username}
                  </p>
                </div>
                <FollowButton />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FollowBar;
