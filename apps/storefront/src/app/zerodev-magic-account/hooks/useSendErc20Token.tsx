import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { useWriteContracts, useCallsStatus } from "wagmi/experimental";
import { parseUnits, erc20Abi } from "viem";

interface UseSendErc20TokenParams {
  onSuccess: (userOpHash: string) => void;
}

export function useSendErc20Token({ onSuccess }: UseSendErc20TokenParams) {
  const { address, chainId: currentChainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractsAsync, data: id } = useWriteContracts();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const mutation = useMutation({
    mutationFn: async ({
      tokenAddress,
      toAddress,
      chainId,
      amount,
      decimals,
    }: {
      tokenAddress: `0x${string}`;
      toAddress: `0x${string}`;
      chainId: number;
      amount: string;
      decimals: number;
    }) => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      setIsTransitioning(true);

      const parsedAmount = parseUnits(amount, decimals);

      if (currentChainId !== chainId) {
        await switchChainAsync({ chainId });
      }

      const tx = {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "transfer",
        args: [toAddress, parsedAmount],
      };

      const result = await writeContractsAsync({
        contracts: [tx],
      });

      console.log("ERC20 transfer transaction posted:", result);
      return result;
    },
    onError: (error) => {
      console.error("ERC20 transfer failed", error);
      setIsTransitioning(false);
    },
  });

  const { data: contractStatusData, refetch: refetchContractStatus } = useCallsStatus({
    id: id as string,
    query: {
      enabled: !!id,
      refetchInterval: (data) =>
        data?.state.data?.status === "CONFIRMED" ? false : 1000,
    },
  });

  useEffect(() => {
    if (contractStatusData?.status === "CONFIRMED" && isTransitioning && !mutation.isPending) {
      refetchContractStatus();
      setIsTransitioning(false);
      onSuccess?.(mutation.data as string);
    }
  }, [contractStatusData?.status, onSuccess, refetchContractStatus, mutation.isPending, isTransitioning, mutation.data]);

  return {
    sendToken: mutation.mutate,
    isLoading: mutation.isPending || isTransitioning,
    error: mutation.error,
    contractStatus: contractStatusData?.status,
    isContractStatusLoading: contractStatusData?.status === "PENDING",
  };
}