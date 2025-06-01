"use client";

import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { mutate } from "swr";

import useTweetModal from "@/hooks/useTweetModal";
import useLoginModal from "@/hooks/useLoginModal";
import useCurrentUser from "@/hooks/useCurrentUser";

import Avatar from "../Avatar";
import MediaUpload from "../MediaUpload";

const TweetModal = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: currentUser } = useCurrentUser();
  const tweetModal = useTweetModal();
  const loginModal = useLoginModal();

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
        toast.error('Please sign in to tweet');
        loginModal.onOpen();
        return;
      }

      // Upload media if present
      let mediaUrl = null;
      let mediaType = null;
      
      if (media) {
        mediaUrl = await uploadMedia(media.file);
        mediaType = media.type;
      }

      const requestBody = {
        body,
        ...(mediaUrl && { [mediaType === 'image' ? 'image' : 'video']: mediaUrl, mediaType })
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      toast.success('Tweet created!');
      setBody('');
      setMedia(null);
      
      // Revalidate posts cache
      mutate('/api/posts');
      
      router.refresh();
      tweetModal.onClose();
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [body, media, session, router, tweetModal, loginModal]);  const bodyContent = (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-start">
        {currentUser && (
          <div className="flex-shrink-0">
            <Avatar
              userId={currentUser.id || ''}
              profileImage={currentUser.profileImage || null}
            />
          </div>
        )}
        <div className="flex-1">
          <textarea
            className="
              w-full
              p-3
              text-xl
              bg-transparent
              border-none
              outline-none
              text-white
              placeholder-neutral-500
              resize-none
              min-h-[120px]
              max-h-[300px]
              leading-6
            "
            placeholder="What's happening?"
            disabled={isLoading}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          
          {/* Media Upload */}
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
          
          {/* Character counter and tweet button */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
            <div className="flex items-center gap-4">
              <div className="text-neutral-500 text-sm">
                {body.length > 0 && (
                  <span className={body.length > 280 ? 'text-red-500' : 'text-neutral-500'}>
                    {body.length}/280
                  </span>
                )}
              </div>
            </div>
            
            <button
              onClick={onSubmit}
              disabled={isLoading || (body.trim().length === 0 && !media) || body.length > 280}
              className="
                px-6
                py-2
                bg-sky-500
                hover:bg-sky-600
                disabled:bg-neutral-600
                disabled:cursor-not-allowed
                text-white
                font-semibold
                rounded-full
                transition-colors
                duration-200
              "
            >
              {isLoading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <>
      {tweetModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-800 bg-opacity-70">
          <div className="relative w-full max-w-xl mx-4 bg-black rounded-2xl shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
              <h2 className="text-xl font-bold text-white">Compose Tweet</h2>
              <button
                onClick={tweetModal.onClose}
                className="p-2 rounded-full hover:bg-neutral-900 transition-colors"
                disabled={isLoading}
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6">
              {bodyContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TweetModal;
