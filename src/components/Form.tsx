"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

import Avatar from "./Avatar";
import Button from "./Button";
import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";

interface FormProps {
  placeholder: string;
  isComment?: boolean;
  postId?: string;
}

const Form: React.FC<FormProps> = ({ placeholder, isComment, postId }) => {
  const router = useRouter();
  const { data: session } = useSession();
  
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!session) {
        return loginModal.onOpen();
      }

      const url = isComment ? `/api/comments?postId=${postId}` : '/api/posts';
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body })
      });

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      toast.success(isComment ? 'Comment created!' : 'Tweet created!');
      setBody('');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [body, isComment, postId, session, router, loginModal]);
  return (
    <div className="border-b-[1px] border-neutral-800 px-4 sm:px-6 py-4">
      {session ? (
        <div className="flex flex-row gap-3 sm:gap-4">
          <div className="flex-shrink-0">            <Avatar 
              userId={session.user?.id || ''} 
              profileImage={session.user?.image || null} 
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
                sm:min-h-[100px]
              "
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
            <div className="mt-4 flex flex-row justify-end">
              <Button 
                disabled={isLoading || !body} 
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
