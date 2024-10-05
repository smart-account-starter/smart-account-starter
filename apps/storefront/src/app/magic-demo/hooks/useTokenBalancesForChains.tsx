import { useQueries } from "@tanstack/react-query";
import { chains } from "../utils/constants";
import { getTokenBalances } from "../services/uniswap/BalanceService";

export function useTokenBalancesForChains(address?: string) {
  const queries = useQueries({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    queries: Object.entries(chains).map(([chainId, _]) => ({
      queryKey: ["tokenBalances", address, chainId],
      queryFn: () => getTokenBalances(address ?? "", Number(chainId)),
      enabled: !!address,
    })),
  });

  const isLoading = queries.some((query) => query.isLoading);
  const error = queries.find((query) => query.error)?.error || null;

  const data = queries.reduce((acc, query, index) => {
    if (query.data && Object.keys(query.data).length > 0) {
      acc[Number(Object.keys(chains)[index])] = query.data;
    }
    return acc;
  }, {} as Record<number, Record<string, number>>);

  const refetchAll = () => {
    queries.forEach((query) => query.refetch());
  };

  return { data, isLoading, error, refetch: refetchAll };
}
