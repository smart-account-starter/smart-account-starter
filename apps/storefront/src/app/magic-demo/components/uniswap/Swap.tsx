import { useState, useMemo, useCallback } from "react";
import { ChevronDownIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import usdcLogo from "../../assets/usdc.png";
import { Token } from "@uniswap/sdk-core";
import { arbitrum } from "viem/chains";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { tokenAddresses, tokenDecimals } from "../../utils/constants";
import { useReadCab } from "@zerodev/magic-account";
import TokenSelectModal from "./TokenSelectModal";
import { tokens as tokenData } from "../../utils/utils";
import { useTokenBalance } from "../../hooks/useTokenBalance";
import { useSwap } from "../../hooks/useSwap";
import { useUniswapQuote } from "../../hooks/useUniswapQuote";
import { toast } from "react-toastify";
import { useTokenBalancesForChains } from "../../hooks/useTokenBalancesForChains";
import { Button } from "@mui/material";
import TransactionSuccessMessage from "../TransactionSuccessMessage";

function Swap() {
  const [isSellingUSDC, setIsSellingUSDC] = useState(true);
  const [sellAmount, setSellAmount] = useState<string>("");
  const { address, chainId: isConnected } = useAccount();
  const [selectedChainId, setSelectedChainId] = useState(Number(arbitrum.id));
  const { data: cabBalance } = useReadCab();
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState("WETH");
  const { refetch: refetchBalances } = useTokenBalancesForChains(address);

  const {
    data: swapTokenBalance,
    isLoading: isBalanceLoading,
    error: balanceError,
    refetch: refetchBalance,
  } = useTokenBalance(
    selectedToken as keyof (typeof tokenAddresses)[keyof typeof tokenAddresses],
    selectedChainId
  );

  const { swap, isLoading } = useSwap({
    onSuccess: (userOpHash: string) => {
      toast.success(
        <TransactionSuccessMessage
          userOpHash={userOpHash}
          message="Swap successful"
        />,
        {
          position: "bottom-right",
          autoClose: 15000,
        }
      );
      setSellAmount("");
      refetchBalance();
      refetchBalances();
    },
  });

  const tokens = useMemo(() => {
    const chainTokens =
      tokenAddresses[selectedChainId as keyof typeof tokenAddresses];
    return {
      USDC: new Token(selectedChainId, chainTokens.USDC, 6, "USDC", "USD Coin"),
      [selectedToken]: new Token(
        selectedChainId,
        chainTokens[selectedToken as keyof typeof chainTokens],
        tokenDecimals[selectedToken as keyof typeof tokenDecimals] || 18,
        selectedToken,
        selectedToken
      ),
    };
  }, [selectedChainId, selectedToken]);

  const handleSwapDirection = useCallback(() => {
    setIsSellingUSDC(!isSellingUSDC);
    setSellAmount("");
  }, [isSellingUSDC]);

  const sellToken = isSellingUSDC
    ? tokens.USDC
    : tokens[selectedToken as keyof typeof tokens];
  const buyToken = isSellingUSDC
    ? tokens[selectedToken as keyof typeof tokens]
    : tokens.USDC;

  const { data: quoteAmount, isLoading: isQuoteLoading } = useUniswapQuote({
    sellAmount,
    tokenIn: sellToken,
    tokenOut: buyToken,
    fee: 500,
    chainId: selectedChainId,
  });

  const handleTokenSelect = (token: string, chainId: number) => {
    if (selectedToken === "WLD" && chainId !== 10) {
      setSelectedToken("WETH");
      setSellAmount("");
    }
    setSelectedToken(token);
    setSelectedChainId(chainId);
  };

  const handleSwap = async () => {
    if (!address) {
      console.error("Wallet not connected");
      return;
    }

    try {
      await swap({
        sellToken,
        buyToken,
        sellAmount,
        selectedChainId,
      });
    } catch (error) {
      console.error("Swap failed", error);
      // Show an error message to the user
    }
  };

  const renderTokenButton = (isUSDC: boolean, onClick?: () => void) => (
    <button
      className={`flex items-center justify-between bg-white rounded-2xl py-2 px-3 ml-2 ${
        isUSDC ? "" : "hover:bg-gray-50 cursor-pointer"
      }`}
      onClick={isUSDC ? undefined : onClick}
      style={{ minWidth: "120px" }} // Add a minimum width
    >
      <div className="flex items-center">
        <img
          src={
            isUSDC
              ? usdcLogo
              : tokenData.find((token) => token.symbol === selectedToken)?.logo
          }
          alt={isUSDC ? "USDC" : selectedToken}
          className="h-6 w-6 mr-2 rounded-full"
        />
        <div className="flex flex-col items-start">
          <span className="font-semibold text-sm">
            {isUSDC ? "USDC" : selectedToken}
          </span>
          {!isUSDC && (
            <span className="text-xs text-gray-500">
              {getChainName(selectedChainId)}
            </span>
          )}
        </div>
      </div>
      {!isUSDC && <ChevronDownIcon className="h-4 w-4 ml-2 flex-shrink-0" />}
    </button>
  );

  return (
    <div className="bg-white rounded-3xl shadow-lg p-4 w-full">
      <div className="flex justify-center items-center mb-4">
        <h2 className="bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 text-gray-700 rounded-md px-3 py-2 text-sm font-medium">
          Swap to any tokens on any chain
        </h2>
      </div>

      <div className="space-y-4 relative">
        <div className="bg-gray-100 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Sell</span>
            <span className="text-sm text-gray-500">
              Balance:{" "}
              {isSellingUSDC
                ? `$${
                    cabBalance
                      ? Number(formatUnits(cabBalance, 6)).toFixed(2)
                      : "0.00"
                  }`
                : isBalanceLoading
                ? "Loading..."
                : balanceError
                ? "Error fetching balance"
                : `${parseFloat(swapTokenBalance || "0").toFixed(
                    6
                  )} ${selectedToken}`}
            </span>
          </div>
          <div className="flex items-center">
            <input
              type="number"
              value={sellAmount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || parseFloat(value) >= 0) {
                  setSellAmount(value);
                }
              }}
              className="bg-transparent text-3xl font-semibold w-full outline-none border-none focus:border-none active:border-none focus:outline-none focus:ring-0"
              placeholder="0"
              style={{
                WebkitAppearance: "none",
                MozAppearance: "textfield",
                appearance: "textfield",
                margin: 0,
                boxShadow: "none",
              }}
            />
            {renderTokenButton(
              isSellingUSDC,
              isSellingUSDC ? undefined : () => setIsTokenSelectOpen(true)
            )}
          </div>
          {sellAmount && (
            <div className="text-sm text-gray-500 mt-1">
              ${parseFloat(sellAmount).toFixed(2)}
            </div>
          )}
        </div>

        <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 z-5">
          <button
            className="bg-white p-2 rounded-full hover:bg-gray-100 shadow-md"
            onClick={handleSwapDirection}
          >
            <ArrowDownIcon className="h-6 w-6 text-blue-500" />
          </button>
        </div>

        <div className="bg-gray-100 rounded-2xl p-4 mt-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Buy</span>
            <span className="text-sm text-gray-500">
              Balance:{" "}
              {!isSellingUSDC
                ? `$${
                    cabBalance
                      ? Number(formatUnits(cabBalance, 6)).toFixed(2)
                      : "0.00"
                  }`
                : isBalanceLoading
                ? "Loading..."
                : balanceError
                ? "Error fetching balance"
                : `${parseFloat(swapTokenBalance || "0").toFixed(
                    6
                  )} ${selectedToken}`}
            </span>
          </div>
          <div className="flex items-center">
            <input
              type="number"
              value={quoteAmount ?? 0}
              readOnly
              className="bg-transparent text-3xl font-semibold w-full outline-none border-none focus:border-none active:border-none focus:outline-none focus:ring-0"
              placeholder={isQuoteLoading ? "Loading..." : "0"}
              style={{
                WebkitAppearance: "none",
                MozAppearance: "textfield",
                appearance: "textfield",
                margin: 0,
                boxShadow: "none",
              }}
            />
            {renderTokenButton(
              !isSellingUSDC,
              !isSellingUSDC ? undefined : () => setIsTokenSelectOpen(true)
            )}
          </div>
        </div>
      </div>

      <Button
        variant="contained"
        sx={{ textTransform: "none", mt: 2, borderRadius: "1rem" }}
        fullWidth
        onClick={handleSwap}
        disabled={!isConnected || !sellAmount || isLoading}
      >
        {!isConnected
          ? "Connect Account"
          : isLoading
          ? "Swapping..."
          : sellAmount
          ? "Swap"
          : "Enter an amount"}
      </Button>
      <TokenSelectModal
        open={isTokenSelectOpen}
        onClose={() => setIsTokenSelectOpen(false)}
        onSelect={handleTokenSelect}
        selectedChainId={selectedChainId}
      />
    </div>
  );
}

function getChainName(chainId: number): string {
  switch (chainId) {
    case 42161:
      return "Arbitrum";
    case 10:
      return "Optimism";
    case 137:
      return "Polygon";
    default:
      return "Unknown";
  }
}

export default Swap;
