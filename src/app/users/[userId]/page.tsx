"use client";

import { useParams } from "next/navigation";

import Navbar from "@/components/Navbar";
import UserHero from "@/components/users/UserHero";
import UserBio from "@/components/users/UserBio";
import PostFeed from "@/components/posts/PostFeed";
import useUser from "@/hooks/useUser";

const UserProfile = () => {
  const params = useParams();
  const userId = Array.isArray(params?.userId) ? params.userId[0] : params.userId as string;
  const { data: fetchedUser, isLoading } = useUser(userId);

  if (isLoading) {
    return (
      <div>
        <Navbar label="Profile" showBackArrow />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
        </div>
      </div>
    );
  }

  if (!fetchedUser) {
    return (
      <div>
        <Navbar label="Profile" showBackArrow />
        <div className="text-white text-center p-6">User not found</div>
      </div>
    );
  }
  return (
    <>      <Navbar label={fetchedUser.name || ""} showBackArrow />
      <UserHero 
        userId={fetchedUser.id} 
        coverImage={fetchedUser.coverImage}
        profileImage={fetchedUser.profileImage}
      />
      <UserBio user={fetchedUser} />
      <PostFeed userId={fetchedUser.id} />
    </>
  );
};

export default UserProfile;
