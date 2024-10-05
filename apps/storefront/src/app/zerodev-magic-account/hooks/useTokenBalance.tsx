import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { getTokenBalance } from "../services/uniswap/BalanceService";
import { tokenAddresses } from "../utils/constants";

export function useTokenBalance(
  token: keyof (typeof tokenAddresses)[keyof typeof tokenAddresses],
  chainId: number
) {
  const { address } = useAccount();

  return useQuery({
    queryKey: ["tokenBalance", address, chainId, token],
    queryFn: () => getTokenBalance(address!, chainId, token),
    enabled: !!address,
    staleTime: 30000, // Consider data stale after 30 seconds
    refetchInterval: 60000, // Refetch every 60 seconds
  });
}
