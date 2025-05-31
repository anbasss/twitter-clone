import useSWR from 'swr';
import fetcher from '@/libs/fetcher';

const useComments = (postId: string) => {
  const url = postId ? `/api/comments?postId=${postId}` : null;  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    refreshInterval: 0, // Disable automatic polling
    revalidateOnFocus: false, // Disable revalidation on window focus
    revalidateOnReconnect: true, // Revalidate on reconnect
    dedupingInterval: 2000, // Dedupe requests within 2 seconds
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

export default useComments;
