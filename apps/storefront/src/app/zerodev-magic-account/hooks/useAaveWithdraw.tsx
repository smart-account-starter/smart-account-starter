import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { useSendCalls, useCallsStatus } from "wagmi/experimental";
import {
  AaveWithdrawService,
} from "../services/aave/AaveWithdrawService";
import { parseUnits } from "viem";
import { mcUSDC } from "../services/aave/utils";

interface UseAaveWithdrawParams {
  onSuccess: (userOpHash: string) => void;
}

export function useAaveWithdraw({ onSuccess }: UseAaveWithdrawParams) {
  const { address, chainId: currentChainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { sendCallsAsync, data: id } = useSendCalls();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const aaveWithdrawService = new AaveWithdrawService();

  const mutation = useMutation({
    mutationFn: async ({
      chainId,
      amount,
    }: {
      chainId: number;
      amount: string;
    }) => {
      if (!address) {
        throw new Error("No address found");
      }
      setIsTransitioning(true);

      const parsedAmount = parseUnits(amount, 6);
      if (!parsedAmount) {
        throw new Error("Invalid amount");
      }

      const tokenInfo = mcUSDC.find(token => token.chainId === chainId);
      if (!tokenInfo) {
        throw new Error(`Unsupported chain ID: ${chainId}`);
      }
      const tokenAddress = tokenInfo.address;


      const encodedTx = aaveWithdrawService.encodeWithdrawTx(
        tokenAddress,
        chainId,
        parsedAmount,
        address
      );

      if (currentChainId !== chainId) {
        await switchChainAsync({ chainId });
      }

      const calls = [{
        to: encodedTx.to,
        value: encodedTx.value || BigInt(0),
        data: encodedTx.data || "0x",
      }];

      const result = await sendCallsAsync({ calls });
      console.log("Withdraw transaction posted:", result);
      return result;
    },
    onError: (error) => {
      console.error("Withdraw failed", error);
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
    withdraw: mutation.mutate,
    isLoading: mutation.isPending || isTransitioning,
    error: mutation.error,
    callStatus: callStatusData?.status,
    isCallStatusLoading: callStatusData?.status === "PENDING",
  };
}