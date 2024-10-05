import { useQuery } from "@tanstack/react-query";
import {
  AaveV3YieldService,
  YieldInfo,
} from "../services/aave/AaveV3YieldService";

const aaveV3YieldService = new AaveV3YieldService();

export function useAaveYieldInfo(tokenSymbol: "USDC" | "USDT" = "USDC") {
  return useQuery<YieldInfo[], Error>({
    queryKey: ["aaveYieldInfo", tokenSymbol],
    queryFn: () => aaveV3YieldService.getYieldInfoForSymbol(tokenSymbol),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
