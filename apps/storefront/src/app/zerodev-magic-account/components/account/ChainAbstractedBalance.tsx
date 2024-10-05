import React from "react";
import { useState } from "react";
import { useReadCab } from "@zerodev/magic-account";
import { formatUnits } from "viem";
import { useMemo } from "react";
import { tokens } from "../../utils/utils";
import SendIcon from "./SendIcon";
import SendModal from "./SendModal";

function ChainAbstractedBalance() {
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const { data: cabBalance } = useReadCab({
    refetchInterval: 1000,
  });

  const usdcToken = useMemo(
    () => tokens.find((token) => token.symbol === "USDC"),
    []
  );

  console.log(usdcToken);

  return (
    <>
      <div className="mt-4 bg-slate-100 rounded-md flex flex-row items-stretch">
        <div className="flex-grow p-4">
          <p className="text-sm font-medium">Chain-abstracted balance (CAB)</p>
          <div className="flex items-end">
            <p className="text-3xl font-bold">
              {cabBalance ? formatUnits(cabBalance, 6) : "0.00"}
            </p>
            <span className="text-lg ml-2 flex items-center gap-1">
              <img src={usdcToken?.logo.src} alt="USDC" className="w-4 h-4 ml-1" />
              USDC
            </span>
          </div>
        </div>
        <button
          className="bg-slate-100 text-blue-500 rounded-r-md flex flex-col items-center justify-center gap-1 hover:bg-slate-200 transition-colors px-4"
          onClick={() => setSendModalOpen(true)}
        >
          <SendIcon className="size-4 transform -rotate-45" />
          <span>Send</span>
        </button>
      </div>
      <SendModal open={sendModalOpen} onClose={() => setSendModalOpen(false)} />
    </>
  );
}

export default ChainAbstractedBalance;
