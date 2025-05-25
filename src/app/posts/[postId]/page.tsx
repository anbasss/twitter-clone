"use client";

import { useParams } from 'next/navigation';
import { ClipLoader } from 'react-spinners';

import Header from '@/components/Header';
import PostItem from '@/components/posts/PostItem';
import Form from '@/components/Form';
import CommentFeed from '@/components/posts/CommentFeed';
import useSWR from 'swr';
import fetcher from '@/libs/fetcher';

const PostView = () => {
  const params = useParams();
  const postId = Array.isArray(params?.postId) ? params.postId[0] : params?.postId as string;

  const { data: post, isLoading: isLoadingPost } = useSWR(
    postId ? `/api/posts/${postId}` : null, 
    fetcher
  );
  if (isLoadingPost || !post) {
    return (
      <div className="flex justify-center items-center h-full">
        <ClipLoader color="lightblue" size={80} />
      </div>
    );
  }

  return (
    <>
      <Header label="Tweet" showBackArrow />
      <PostItem data={post} />
      <Form
        postId={postId}
        isComment
        placeholder="Tweet your reply"
      />
      <CommentFeed postId={postId} />
    </>
  );
};

export default PostView;
