import { useState, useCallback, useEffect } from "react";
import { useEstimateFeesCab } from "@zerodev/magic-account";
import { encodeFunctionData, parseUnits } from "viem";
import { erc20Abi } from "viem";
import { tokenAddresses, tokenDecimals } from "../utils/constants";

export function useEstimateFees(
  selectedChainId: number,
  recipient: string,
  amount: string,
  address: string
) {
  const [baseFeeEstimate, setBaseFeeEstimate] = useState<number | null>(null);
  const [feeEstimate, setFeeEstimate] = useState<string | null>(null);
  const [isLoadingEstimateFees, setIsLoadingEstimateFees] = useState(false);
  const [feeError, setFeeError] = useState(false);
  const { estimateFees } = useEstimateFeesCab();

  const estimateBaseFee = useCallback(async () => {
    if (!selectedChainId) return;
    setFeeError(false);

    try {
      const tokenAddress = tokenAddresses[
        selectedChainId as keyof typeof tokenAddresses
      ]?.USDC as `0x${string}`;

      if (!tokenAddress) {
        console.error("USDC address not found for the selected chain");
        setBaseFeeEstimate(null);
        return;
      }

      const minimalTransferAmount = "0.000001"; // Minimal amount for base fee estimation
      const transferCall = {
        to: tokenAddress,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: "transfer",
          args: [
            address as `0x${string}`,
            parseUnits(minimalTransferAmount, tokenDecimals.USDC),
          ],
        }),
        value: 0n,
      };

      setIsLoadingEstimateFees(true);
      const result = await estimateFees({
        calls: [transferCall],
        repayTokens: [],
        chainId: selectedChainId,
      });
      setIsLoadingEstimateFees(false);

      if (result.error) {
        setBaseFeeEstimate(null);
        setFeeError(true);
        console.error("Error estimating base fees:", result.error);
        return;
      }

      const baseFee = Number(result.estimatedFee);
      const feeBuffer = 1.03;
      const estimatedBaseFee = baseFee * feeBuffer;
      setBaseFeeEstimate(estimatedBaseFee);
    } catch (error) {
      console.error("Error estimating base fee:", error);
      setBaseFeeEstimate(null);
      setIsLoadingEstimateFees(false);
      setFeeError(true);
    }
  }, [selectedChainId, estimateFees, address]);

  const estimateTransactionFees = useCallback(async () => {
    setFeeError(false);
    if (
      !recipient ||
      !amount ||
      !selectedChainId ||
      !address ||
      parseFloat(amount) <= 0
    ) {
      setFeeEstimate(null);
      return;
    }

    try {
      const tokenAddress = tokenAddresses[
        selectedChainId as keyof typeof tokenAddresses
      ]?.USDC as `0x${string}`;

      if (!tokenAddress) {
        console.error("USDC address not found for the selected chain");
        setFeeEstimate(null);
        return;
      }

      const transferCall = {
        to: tokenAddress,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: "transfer",
          args: [
            recipient as `0x${string}`,
            parseUnits(amount, tokenDecimals.USDC),
          ],
        }),
        value: 0n,
      };

      setIsLoadingEstimateFees(true);
      const result = await estimateFees({
        calls: [transferCall],
        repayTokens: [],
        chainId: selectedChainId,
      });
      setIsLoadingEstimateFees(false);

      if (result.error) {
        setFeeEstimate(null);
        setFeeError(true);
        console.error("Error estimating fees:", result.error);
        return;
      }

      const baseFee = Number(result.estimatedFee);
      const feeBuffer = 1.03;
      const estimatedFee = parseFloat((baseFee * feeBuffer).toFixed(6));
      setFeeEstimate(estimatedFee.toFixed(6));
    } catch (error) {
      console.error("Error estimating transaction fees:", error);
      setFeeEstimate(null);
      setIsLoadingEstimateFees(false);
      setFeeError(true);
    }
  }, [recipient, amount, selectedChainId, estimateFees, address]);

  useEffect(() => {
    estimateBaseFee();
  }, [estimateBaseFee, selectedChainId]);

  useEffect(() => {
    estimateTransactionFees();
  }, [estimateTransactionFees, selectedChainId, amount]);

  return { baseFeeEstimate, feeEstimate, isLoadingEstimateFees, feeError };
}
