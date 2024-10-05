import { useQuery } from "@tanstack/react-query";
import { formatUnits, parseUnits } from "viem";
import { useAccount } from "wagmi";
import { AaveGetSuppliesService } from "../services/aave/AaveGetSuppliesService";

export type Position = {
  token: string;
  chainId: number;
  amount: string;
};

export type Totals = {
  usdc: string;
};

type AavePositionsData = {
  positions: Position[];
  totals: Totals;
};

const fetchPositions = async (address: string): Promise<AavePositionsData> => {
  const aaveGetSuppliesService = new AaveGetSuppliesService();
  const fetchedPositions = await aaveGetSuppliesService.getSuppliedPositions(
    address
  );

  const positions = fetchedPositions.map((position) => ({
    ...position,
    amount: formatUnits(BigInt(position.amount), 6),
  }));

  const totalUSDC = positions
    .filter((x) => x.token === "USDC")
    .reduce((acc, curr) => acc + parseUnits(curr.amount, 6), BigInt(0));

  return {
    positions,
    totals: {
      usdc: formatUnits(totalUSDC, 6),
    },
  };
};

export const useAavePositions = () => {
  const { address } = useAccount();

  return useQuery<AavePositionsData, Error>({
    queryKey: ["aavePositions", address],
    queryFn: () => fetchPositions(address || ""),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 1 * 60 * 1000, // 1 minute
  });
};
