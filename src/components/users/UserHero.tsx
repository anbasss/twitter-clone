"use client";

import Image from "next/image";
import Avatar from "@/components/Avatar";

interface UserHeroProps {
  userId: string;
  coverImage: string | null;
  profileImage: string | null;
}

const UserHero: React.FC<UserHeroProps> = ({ userId, coverImage, profileImage }) => {
  return (
    <div className="bg-neutral-700 h-44 relative">
      {coverImage && (
        <Image
          src={coverImage}
          fill
          alt="Cover Image"
          style={{ objectFit: "cover" }}
        />
      )}      <div className="absolute -bottom-16 left-4">
        <Avatar userId={userId} isLarge hasBorder profileImage={profileImage} />
      </div>
    </div>
  );
};

export default UserHero;
