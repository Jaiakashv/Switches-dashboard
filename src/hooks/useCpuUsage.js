import { useQuery } from '@tanstack/react-query'
import { fetchCpuUsage } from '../api/analyticsApi'

/**
 * Custom hook for fetching and managing real-time CPU usage data using TanStack Query
 * @param {string} timeRange - Time range for data (1h, 6h, 12h, 24h)
 * @param {number} pollInterval - Polling interval in milliseconds (default: 60000ms)
 * @returns {Object} CPU usage data, loading state, error state, and refetch function
 */
export const useCpuUsage = (timeRange = '24h', pollInterval = 60000) => {
  const query = useQuery({
    queryKey: ['cpuUsage', timeRange],
    queryFn: () => fetchCpuUsage(timeRange),
    refetchInterval: pollInterval,
    staleTime: pollInterval - 1000, // Consider data stale just before next poll
    gcTime: 300000, // Keep in cache for 5 minutes (TanStack Query v5 uses gcTime instead of cacheTime)
  })

  return {
    data: query.data,
    loading: query.isLoading,
    error: query.error ? 'Failed to load CPU usage data.' : '',
    refetch: query.refetch
  }
}
