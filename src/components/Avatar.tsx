"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface AvatarProps {
  userId: string;
  isLarge?: boolean;
  hasBorder?: boolean;
  profileImage: string | null;
}

const Avatar: React.FC<AvatarProps> = ({
  userId,
  isLarge,
  hasBorder,
  profileImage
}) => {
  const router = useRouter();

  const onClick = useCallback((event: any) => {
    event.stopPropagation();
    
    const url = `/users/${userId}`;
    router.push(url);
  }, [router, userId]);
  return (
    <div
      className={`
        ${hasBorder ? 'border-4 border-black' : ''}
        ${isLarge ? 'h-24 w-24 sm:h-32 sm:w-32' : 'h-10 w-10 sm:h-12 sm:w-12'}
        rounded-full 
        hover:opacity-90 
        transition-opacity 
        duration-200
        cursor-pointer
        relative
        overflow-hidden
        bg-neutral-700
        flex-shrink-0
      `}
    >
      <Image
        fill
        style={{
          objectFit: 'cover',
          borderRadius: '100%'
        }}
        alt="Avatar"
        onClick={onClick}
        src={profileImage || '/images/placeholder.png'}
        className="transition-transform duration-200 hover:scale-105"
      />
    </div>
  );
};

export default Avatar;
