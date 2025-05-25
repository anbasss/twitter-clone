"use client";

import { useMemo } from "react";
import { BiCalendar } from "react-icons/bi";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

import Button from "../Button";
import useEditModal from "@/hooks/useEditModal";
import useFollow from "@/hooks/useFollow";

interface User {
  id: string;
  name: string | null;
  username: string | null;
  bio: string | null;
  email: string | null;
  image: string | null;
  coverImage: string | null;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
  followingIds: string[];
  followerIds: string[];
  hasNotification: boolean | null;
}

interface UserBioProps {
  user: User;
}

const UserBio: React.FC<UserBioProps> = ({ user }) => {
  const { data: session } = useSession();
  const editModal = useEditModal();
  
  const { isFollowing, toggleFollow } = useFollow(user.id);
  
  const createdAt = useMemo(() => {
    if (!user?.createdAt) {
      return null;
    }
    
    return format(new Date(user.createdAt), 'MMMM yyyy');
  }, [user?.createdAt]);
  
  return (
    <div className="border-b-[1px] border-neutral-800 pb-4">
      <div className="flex justify-end p-2">
        {session?.user?.email === user?.email ? (
          <Button secondary label="Edit" onClick={editModal.onOpen} />
        ) : (
          <Button 
            onClick={toggleFollow} 
            label={isFollowing ? 'Unfollow' : 'Follow'}
            secondary={!isFollowing}
            outline={isFollowing}
          />
        )}
      </div>
      <div className="mt-8 px-4">
        <div className="flex flex-col">
          <p className="text-white text-2xl font-semibold">
            {user.name}
          </p>
          <p className="text-md text-neutral-500">
            @{user.username}
          </p>
        </div>
        <div className="flex flex-col mt-4">
          <p className="text-white">
            {user.bio || 'No bio yet.'}
          </p>
          <div className="flex flex-row items-center gap-2 mt-4 text-neutral-500">
            <BiCalendar size={24} />
            <p>
              Joined {createdAt}
            </p>
          </div>
        </div>
        <div className="flex flex-row items-center mt-4 gap-6">
          <div className="flex flex-row items-center gap-1">
            <p className="text-white">{user.followingIds?.length || 0}</p>
            <p className="text-neutral-500">Following</p>
          </div>
          <div className="flex flex-row items-center gap-1">
            <p className="text-white">{user.followerIds?.length || 0}</p>
            <p className="text-neutral-500">Followers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBio;
