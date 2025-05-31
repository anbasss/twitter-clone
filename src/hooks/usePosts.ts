import useSWR from 'swr';
import fetcher from '@/libs/fetcher';

const usePosts = (userId?: string) => {
  const url = userId ? `/api/users/${userId}/posts` : '/api/posts';
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    refreshInterval: 0, // Disable automatic polling
    revalidateOnFocus: false, // Disable revalidation on window focus
    revalidateOnReconnect: true, // Revalidate on reconnect
    dedupingInterval: 2000, // Reduced dedupe interval for faster updates
    errorRetryCount: 3, // Retry failed requests 3 times
    errorRetryInterval: 1000, // Wait 1 second between retries
    revalidateIfStale: true, // Revalidate if data is stale
    revalidateOnMount: true, // Always revalidate on mount
  });

  return {
    data,
    error,
    isLoading,
    mutate
  };
};

export default usePosts;
