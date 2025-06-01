"use client";

import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { AiOutlineHeart, AiFillHeart, AiOutlineMessage } from 'react-icons/ai';
import { formatDistanceToNowStrict } from 'date-fns';
import { useSession } from 'next-auth/react';
import { mutate } from 'swr';
import Image from 'next/image';

import Avatar from '@/components/Avatar';
import useLoginModal from '@/hooks/useLoginModal';
import usePosts from '@/hooks/usePosts';

interface PostItemProps {
  data: Record<string, any>;
  userId?: string;
}

const PostItem: React.FC<PostItemProps> = ({ data, userId }) => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const { data: session } = useSession();
  const { mutate: mutatePosts } = usePosts(userId);

  const goToUser = useCallback((event: any) => {
    event.stopPropagation();
    
    router.push(`/users/${data.user.id}`);
  }, [router, data.user.id]);

  const goToPost = useCallback(() => {
    router.push(`/posts/${data.id}`);
  }, [router, data.id]);
  const onLike = useCallback(async (event: any) => {
    event.stopPropagation();

    if (!session) {
      return loginModal.onOpen();
    }

    try {
      const response = await fetch('/api/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId: data.id })
      });

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      // Optimistically update the cache instead of router.refresh()
      mutatePosts();
      mutate('/api/posts');
      mutate(`/api/posts/${data.id}`);
    } catch (error) {
      console.log(error);
    }
  }, [data.id, session, loginModal, mutatePosts]);

  const createdAt = useMemo(() => {
    if (!data?.createdAt) {
      return null;
    }

    return formatDistanceToNowStrict(new Date(data.createdAt));
  }, [data?.createdAt]);

  const hasLiked = useMemo(() => {
    const list = data.likedIds || [];
    
    return list.includes(session?.user?.id);
  }, [data.likedIds, session?.user?.id]);
  return (
    <div 
      onClick={goToPost}
      className="
        border-b-[1px] 
        border-neutral-800 
        p-4 
        sm:p-6 
        cursor-pointer 
        hover:bg-neutral-900/50
        transition-colors
        duration-200
      "
    >
      <div className="flex flex-row items-start gap-3 sm:gap-4">
        <div className="flex-shrink-0">
          <Avatar userId={data.user.id} profileImage={data.user.profileImage} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-row items-center gap-1 sm:gap-2 mb-1">
            <p 
              onClick={goToUser} 
              className="
                text-white 
                font-semibold 
                cursor-pointer 
                hover:underline
                text-sm
                sm:text-base
                truncate
                max-w-[120px]
                sm:max-w-none
            ">
              {data.user.name}
            </p>
            <span 
              onClick={goToUser} 
              className="
                text-neutral-500
                cursor-pointer
                hover:underline
                text-xs
                sm:text-sm
                truncate
                max-w-[80px]
                sm:max-w-[120px]
                lg:max-w-none
            ">
              @{data.user.username}
            </span>
            <span className="text-neutral-500 text-xs sm:text-sm flex-shrink-0">
              · {createdAt}
            </span>
          </div>          <div className="text-white text-sm sm:text-base leading-relaxed mb-3">
            {data.body}
          </div>
          
          {/* Media Display */}
          {data.image && (
            <div className="mb-4 rounded-lg overflow-hidden border border-neutral-700">
              <Image
                src={data.image}
                alt="Post image"
                width={500}
                height={300}
                className="w-full h-auto max-h-96 object-cover cursor-pointer"
                onClick={goToPost}
              />
            </div>
          )}
          
          {data.video && (
            <div className="mb-4 rounded-lg overflow-hidden border border-neutral-700">
              <video
                src={data.video}
                controls
                className="w-full h-auto max-h-96"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          
          <div className="flex flex-row items-center gap-8 sm:gap-12">
            <div 
              className="
                flex 
                flex-row 
                items-center 
                text-neutral-500 
                gap-2 
                cursor-pointer 
                transition-colors 
                duration-200
                hover:text-sky-500
                group
            ">
              <div className="p-2 rounded-full group-hover:bg-sky-500/10 transition-colors duration-200">
                <AiOutlineMessage size={18} className="sm:w-5 sm:h-5" />
              </div>
              <p className="text-xs sm:text-sm">
                {data.comments?.length || 0}
              </p>
            </div>
            <div
              onClick={onLike}
              className="
                flex 
                flex-row 
                items-center 
                text-neutral-500 
                gap-2 
                cursor-pointer 
                transition-colors 
                duration-200
                hover:text-red-500
                group
            ">
              <div className="p-2 rounded-full group-hover:bg-red-500/10 transition-colors duration-200">
                {hasLiked ? (
                  <AiFillHeart size={18} className="text-red-500 sm:w-5 sm:h-5" />
                ) : (
                  <AiOutlineHeart size={18} className="sm:w-5 sm:h-5" />
                )}
              </div>
              <p className="text-xs sm:text-sm">
                {data.likedIds?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
