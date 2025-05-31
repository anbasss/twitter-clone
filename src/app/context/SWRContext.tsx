"use client";

import { SWRConfig } from 'swr';
import fetcher from '@/libs/fetcher';

interface SWRProviderProps {
  children: React.ReactNode;
}

const SWRProvider: React.FC<SWRProviderProps> = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher,
        refreshInterval: 0, // Disable automatic polling by default
        revalidateOnFocus: false, // Disable revalidation on window focus
        revalidateOnReconnect: true, // Revalidate on reconnect
        dedupingInterval: 1000, // Reduced deduping interval for faster updates
        errorRetryCount: 3, // Retry failed requests 3 times
        errorRetryInterval: 1000, // Wait 1 second between retries
        revalidateIfStale: true, // Revalidate if data is stale
        revalidateOnMount: true, // Always revalidate on mount
        shouldRetryOnError: true, // Enable retry on error
        keepPreviousData: true, // Keep previous data while loading new data
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRProvider;
