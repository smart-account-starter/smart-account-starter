import { useState, useEffect } from "react";
import UsdcSaveModal from "./UsdcSaveWidget";
import MySavings from "./MySavings";
import {
  AaveV3YieldService,
  YieldInfo,
} from "../../services/aave/AaveV3YieldService";
import { useAccount } from "wagmi";

function AAVE() {
  const [usdcYields, setUsdcYields] = useState<YieldInfo[] | null>(null);
  const { isConnected } = useAccount();

  useEffect(() => {
    const aaveYieldService = new AaveV3YieldService();

    // Fetch USDC yields
    aaveYieldService.getSortedYieldsForSymbol("USDC").then((yields) => {
      setUsdcYields(yields);
    });
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {!usdcYields ? (
        <>
          <div className="bg-white rounded-3xl shadow-md p-6 animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-24 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
          {isConnected && (
            <div className="bg-white rounded-3xl shadow-md p-6 animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          )}
        </>
      ) : (
        <>
          <UsdcSaveModal usdcYields={usdcYields} />
          {isConnected && <MySavings />}
        </>
      )}
    </div>
  );
}

export default AAVE;
