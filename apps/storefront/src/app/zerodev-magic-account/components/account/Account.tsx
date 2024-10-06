import { useAccount } from "wagmi";
import { useState } from "react";
import { Tooltip } from "@mui/material";
import { useEnableCab } from "@zerodev/magic-account";
import useAutoEnableCab from "../../hooks/useAutoEnableCab";
import TokenBalances from "../TokenBalances";
import ChainAbstractedBalance from "./ChainAbstractedBalance";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QrCodeIcon from "@mui/icons-material/QrCode"; // Updated import
import QRCode from "react-qr-code";
import { getChainIcon, chains } from "../../utils/utils";

interface QRCodeTooltipProps {
  address: string;
}

const QRCodeTooltip: React.FC<QRCodeTooltipProps> = ({ address }) => {
  return (
    <Tooltip
      title={
        <div style={{ backgroundColor: "white", padding: "10px" }}>
          <QRCode value={address} size={128} />
        </div>
      }
      placement="top"
      arrow
    >
      <button className="ml-2">
        <QrCodeIcon fontSize="small" />
      </button>
    </Tooltip>
  );
};

function Account() {
  const { address, isConnected } = useAccount();
  const { isEnabledOnCurrentChain } = useEnableCab();
  const { isEnablingCab } = useAutoEnableCab();

  const [tooltipOpen, setTooltipOpen] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(address || "");
    setTooltipOpen(true);
    setTimeout(() => setTooltipOpen(false), 1500);
  };

  const shortenAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  const displayAddress = address || "";

  if (!isConnected) {
    return (
      <>
        Connect to view account
      </>
    );
  }

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg md:mt-[70px] w-full">
      <div className="px-4 py-6 sm:px-6">
        <h3 className="text-xl font-semibold leading-7 text-gray-900">
          Magic Account
        </h3>
        <ChainAbstractedBalance />
      </div>
      <div className="border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:items-center bg-slate-100">
            <dt className="text-sm font-medium text-gray-900 flex flex-col sm:col-span-2">
              <span>Address</span>
              <span className="text-sm font-normal text-gray-500">
                {shortenAddress(displayAddress)}
              </span>
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0 sm:text-right">
              <div className="flex justify-end">
                <Tooltip
                  open={tooltipOpen}
                  title="Copied!"
                  placement="top"
                  arrow
                >
                  <button onClick={copyAddress} className="ml-2">
                    <ContentCopyIcon fontSize="small" />
                  </button>
                </Tooltip>
                <QRCodeTooltip address={displayAddress} />
              </div>
            </dd>
          </div>
          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:items-center">
            <dt className="text-sm font-medium text-gray-900 sm:col-span-2">
              Chain abstraction enabled
            </dt>
            <dd className="mt-1 text-sm leading-6 sm:col-span-1 sm:mt-0 sm:text-right">
              <span
                className={`font-semibold ${
                  isEnabledOnCurrentChain("USDC")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {isEnablingCab
                  ? "Enabling..."
                  : isEnabledOnCurrentChain("USDC")
                  ? "Yes"
                  : "No"}
              </span>
            </dd>
          </div>
          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:items-center bg-slate-100">
            <dt className="text-sm font-medium text-gray-900 sm:col-span-2">
              Supported Chains
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0 sm:text-right">
              <div className="flex -space-x-2 overflow-hidden justify-start sm:justify-end">
                {chains.map((chain) => (
                  <img
                    key={chain.id}
                    src={getChainIcon(chain.id).src}
                    alt={chain.name}
                    className="inline-block w-8 h-8 rounded-full ring-2 ring-white"
                  />
                ))}
              </div>
            </dd>
          </div>
        </dl>
      </div>
      {isConnected && <TokenBalances />}
    </div>
  );
}

export default Account;
