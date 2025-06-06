"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { mutate } from "swr";

import Avatar from "./Avatar";
import Button from "./Button";
import MediaUpload from "./MediaUpload";
import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";
import useCurrentUser from "@/hooks/useCurrentUser";
import useComments from "@/hooks/useComments";
import usePosts from "@/hooks/usePosts";

interface FormProps {
  placeholder: string;
  isComment?: boolean;
  postId?: string;
}

const Form: React.FC<FormProps> = ({ placeholder, isComment, postId }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: currentUser } = useCurrentUser();
  
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  // Get SWR mutate functions for cache invalidation
  const { mutate: mutateComments } = useComments(postId || '');
  const { mutate: mutatePosts } = usePosts();
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [media, setMedia] = useState<{ file: File; type: 'image' | 'video' } | null>(null);

  // Helper function to upload media
  const uploadMedia = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload media');
    }
    
    const data = await response.json();
    return data.url;
  };

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!session) {
        return loginModal.onOpen();
      }      const url = isComment ? `/api/comments?postId=${postId}` : '/api/posts';
      
      // Upload media if present
      let mediaUrl = null;
      let mediaType = null;
      
      if (media && !isComment) { // Only allow media in posts, not comments
        try {
          mediaUrl = await uploadMedia(media.file);
          mediaType = media.type;
        } catch (error) {
          toast.error('Failed to upload media');
          setIsLoading(false);
          return;
        }
      }
      
      // Create optimistic update data
      const optimisticData = {
        id: `temp-${Date.now()}`, // Temporary ID for optimistic update
        body,
        image: mediaType === 'image' ? mediaUrl : null,
        video: mediaType === 'video' ? mediaUrl : null,
        mediaType,
        userId: session.user?.id,
        user: {
          id: session.user?.id,
          name: session.user?.name,
          username: session.user?.email?.split('@')[0],
          profileImage: session.user?.image,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...(isComment ? { postId } : { comments: [], likedIds: [], hasLiked: false }),
      };

      // Optimistic updates - update UI immediately
      if (isComment && postId) {
        // Optimistically add comment to comments cache
        mutateComments((currentComments: any) => {
          return currentComments ? [optimisticData, ...currentComments] : [optimisticData];
        }, { revalidate: false });
      } else {
        // Optimistically add post to posts cache
        mutatePosts((currentPosts: any) => {
          return currentPosts ? [optimisticData, ...currentPosts] : [optimisticData];
        }, { revalidate: false });
      }      // Clear form immediately for better UX
      setBody('');
      setMedia(null);
      
      const requestBody = {
        body,
        ...(mediaUrl && { [mediaType === 'image' ? 'image' : 'video']: mediaUrl, mediaType })
      };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const newData = await response.json();
      toast.success(isComment ? 'Comment created!' : 'Tweet created!');
      
      // Revalidate to get real data from server and replace optimistic data
      if (isComment && postId) {
        // Revalidate comments for this specific post
        mutateComments();
        // Also revalidate the specific post to update comment count
        mutate(`/api/posts/${postId}`);
      } else {
        // Revalidate all posts immediately
        mutatePosts();
        mutate('/api/posts');
        // Also invalidate any user-specific posts cache
        mutate((key) => typeof key === 'string' && key.startsWith('/api/users/') && key.endsWith('/posts'));
      }
    } catch (error) {
      toast.error('Something went wrong');
      
      // Rollback optimistic updates on error
      if (isComment && postId) {
        mutateComments();
      } else {
        mutatePosts();
      }
        // Restore form data on error
      setBody(body);
      setMedia(media);
    } finally {
      setIsLoading(false);
    }
  }, [body, media, isComment, postId, session, loginModal, mutateComments, mutatePosts]);
  return (
    <div className="border-b-[1px] border-neutral-800 px-4 sm:px-6 py-4">
      {session ? (
        <div className="flex flex-row gap-3 sm:gap-4">          <div className="flex-shrink-0">
            <Avatar 
              userId={currentUser?.id || ''} 
              profileImage={currentUser?.profileImage || null} 
            />
          </div>
          <div className="w-full min-w-0">
            <textarea
              disabled={isLoading}
              onChange={(e) => setBody(e.target.value)}
              value={body}
              className="
                disabled:opacity-80
                peer
                resize-none 
                mt-2
                sm:mt-3 
                w-full 
                bg-black 
                ring-0 
                outline-none 
                text-lg
                sm:text-xl 
                placeholder-neutral-500 
                text-white
                min-h-[80px]
                sm:min-h-[100px]              "
              placeholder={placeholder}
            ></textarea>
            <hr 
              className="
                opacity-0 
                peer-focus:opacity-100 
                h-[1px] 
                w-full 
                border-neutral-800 
                transition-opacity
                duration-200
              "
            />
            {!isComment && (
              <div className="mt-4">
                <MediaUpload
                  value={media}
                  onChange={(file, type) => {
                    if (file && type) {
                      setMedia({ file, type });
                    } else {
                      setMedia(null);
                    }
                  }}
                  disabled={isLoading}
                />
              </div>
            )}
            <div className="mt-4 flex flex-row justify-end">
              <Button 
                disabled={isLoading || (!body && !media)} 
                onClick={onSubmit} 
                label={isComment ? "Reply" : "Post"}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8 sm:py-12 px-4">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-white text-2xl sm:text-3xl mb-2 font-bold">Welcome to Twitter</h1>
            <p className="text-neutral-400 text-sm sm:text-base mb-6">
              Join today and connect with the world
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button 
                label="Log in" 
                onClick={loginModal.onOpen}
                fullWidth
              />
              <Button 
                label="Sign up" 
                onClick={() => {
                  loginModal.onClose();
                  registerModal.onOpen();
                }}
                secondary
                fullWidth
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
