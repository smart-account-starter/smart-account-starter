import { useState, useMemo } from "react";
import { useTokenBalancesForChains } from "../hooks/useTokenBalancesForChains";
import { chains } from "../utils/constants";
import { useAccount } from "wagmi";
import { tokens } from "../utils/utils";

function TokenBalances() {
  const [selectedToken, setSelectedToken] = useState<string>(tokens[0].symbol);
  const { address } = useAccount();

  const {
    data: balances,
    isLoading,
    error,
  } = useTokenBalancesForChains(address!);

  const tokenTotals = useMemo(() => {
    if (!balances) return {};
    return tokens.reduce((acc, { symbol }) => {
      acc[symbol] = Object.values(balances).reduce(
        (sum, chainBalances) => sum + (chainBalances[symbol] || 0),
        0
      );
      return acc;
    }, {} as Record<string, number>);
  }, [balances]);

  return (
    <div className="bg-white shadow-lg p-6 mx-auto w-full">
      <h3 className="text-xl font-semibold leading-7 text-gray-900">
        Token Balances
      </h3>
      <div className="my-2">
        <select
          className="w-full p-2 border rounded-md text-sm"
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value)}
        >
          {tokens
            .filter((token) => token.symbol !== "USDC")
            .map(({ symbol }) => (
              <option key={symbol} value={symbol}>
                {symbol}{" "}
                {isLoading
                  ? "(Loading...)"
                  : `(${tokenTotals[symbol]?.toFixed(6) || "0.000000"})`}
              </option>
            ))}
        </select>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm font-medium text-gray-500">
          <span>Chain</span>
          <span>Amount</span>
        </div>
        {isLoading ? (
          <div className="text-sm">Loading...</div>
        ) : error ? (
          <div className="text-sm">Error fetching balances</div>
        ) : (
          Object.entries(chains).map(([chainId, { chain }]) => (
            <ChainBalance
              key={chainId}
              chainName={chain.name}
              balance={balances?.[Number(chainId)]?.[selectedToken] || 0}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ChainBalance({
  chainName,
  balance,
}: {
  chainName: string;
  balance: number;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span>{chainName}</span>
      <span>{balance.toFixed(6)}</span>
    </div>
  );
}

export default TokenBalances;
