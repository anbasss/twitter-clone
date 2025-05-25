"use client";

import CommentItem from './CommentItem';
import useComments from '@/hooks/useComments';

interface CommentFeedProps {
  postId: string;
}

const CommentFeed: React.FC<CommentFeedProps> = ({ postId }) => {
  const { data: comments = [], isLoading } = useComments(postId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-neutral-500 text-center p-6">
        No comments yet.
      </div>
    );
  }

  return (
    <>
      {comments.map((comment: Record<string, any>) => (
        <CommentItem key={comment.id} data={comment} />
      ))}
    </>
  );
};

export default CommentFeed;
