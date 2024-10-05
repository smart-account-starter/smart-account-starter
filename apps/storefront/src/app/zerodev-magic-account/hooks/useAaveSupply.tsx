import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { useSendCalls, useCallsStatus } from "wagmi/experimental";
import {
  AaveSupplyEncodeService,
  RawTransaction,
} from "../services/aave/AaveSupplyService";
import { parseUnits } from "viem";

interface UseAaveSupplyParams {
  onSuccess: (userOpHash: string) => void;
}

export function useAaveSupply({ onSuccess }: UseAaveSupplyParams) {
  const { address, chainId: currentChainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { sendCallsAsync, data: id } = useSendCalls();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const aaveSupplyEncodeService = new AaveSupplyEncodeService();

  const mutation = useMutation({
    mutationFn: async ({
      tokenAddress,
      chainId,
      amount,
    }: {
      tokenAddress: `0x${string}`;
      chainId: number;
      amount: string;
    }) => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      setIsTransitioning(true);

      const parsedAmount = parseUnits(amount, 6);
      if (!parsedAmount) {
        throw new Error("Invalid amount");
      }

      const encodedTxs = aaveSupplyEncodeService.encodeSupplyTxs(
        tokenAddress,
        chainId,
        parsedAmount,
        address
      );

      if (currentChainId !== chainId) {
        await switchChainAsync({ chainId });
      }

      const calls = encodedTxs.map((tx: RawTransaction) => ({
        to: tx.to,
        value: tx.value || BigInt(0),
        data: tx.data || "0x",
      }));

      const result = await sendCallsAsync({ calls });
      console.log("Supply transaction posted:", result);
      return result;
    },
    onError: (error) => {
      console.error("Supply failed", error);
      setIsTransitioning(false);
    },
  });

  const { data: callStatusData, refetch: refetchCallStatus } = useCallsStatus({
    id: id as string,
    query: {
      enabled: !!id,
      refetchInterval: (data) =>
        data.state.data?.status === "CONFIRMED" ? false : 1000,
    },
  });

  useEffect(() => {
    if (
      callStatusData?.status === "CONFIRMED" &&
      isTransitioning &&
      !mutation.isPending
    ) {
      refetchCallStatus();
      setIsTransitioning(false);
      onSuccess?.(mutation.data as string);
    }
  }, [
    callStatusData?.status,
    onSuccess,
    refetchCallStatus,
    mutation.isPending,
    isTransitioning,
    mutation.data,
  ]);

  return {
    supply: mutation.mutate,
    isLoading: mutation.isPending || isTransitioning,
    error: mutation.error,
    callStatus: callStatusData?.status,
    isCallStatusLoading: callStatusData?.status === "PENDING",
  };
}
