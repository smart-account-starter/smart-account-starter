import { useQuery } from '@tanstack/react-query';
import { getTokenBalances } from '../services/uniswap/BalanceService';

export function useTokenBalances(address: string, chainId: number) {
  return useQuery({
    queryKey: ['tokenBalances', address, chainId],
    queryFn: () => getTokenBalances(address, chainId),
    enabled: !!address && !!chainId,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  });
}