"use client";

import PostItem from './PostItem';
import usePosts from '@/hooks/usePosts';

interface PostFeedProps {
  userId?: string;
}

const PostFeed: React.FC<PostFeedProps> = ({ userId }) => {
  const { data: posts = [], isLoading, mutate } = usePosts(userId);
  
  if (isLoading) {
    return (
      <div className="divide-y divide-neutral-800">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 sm:p-6 animate-pulse">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-neutral-700 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-4 bg-neutral-700 rounded w-24"></div>
                  <div className="h-3 bg-neutral-700 rounded w-16"></div>
                  <div className="h-3 bg-neutral-700 rounded w-8"></div>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="h-4 bg-neutral-700 rounded w-full"></div>
                  <div className="h-4 bg-neutral-700 rounded w-3/4"></div>
                </div>
                <div className="flex gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-neutral-700 rounded-full"></div>
                    <div className="h-3 bg-neutral-700 rounded w-6"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-neutral-700 rounded-full"></div>
                    <div className="h-3 bg-neutral-700 rounded w-6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="bg-neutral-800 rounded-full p-8 mb-6">
          <svg className="w-12 h-12 text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No posts yet</h3>
        <p className="text-neutral-400 text-center max-w-sm text-sm sm:text-base">
          When you post something, it will show up here. Share your thoughts with the world!
        </p>
      </div>
    );
  }
  return (
    <div className="divide-y divide-neutral-800">
      {posts.map((post: Record<string, any>) => (
        <PostItem
          key={post.id}
          data={post}
        />
      ))}
    </div>
  );
};

export default PostFeed;
