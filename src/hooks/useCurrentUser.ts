import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import fetcher from '@/libs/fetcher';

const useCurrentUser = () => {
  const { data: session } = useSession();
  const { data, error, isLoading, mutate } = useSWR(
    session?.user?.email ? '/api/users/current' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 10000
    }
  );

  return {
    data: data ?? session?.user,
    error,
    isLoading,
    mutate
  };
};

export default useCurrentUser;
