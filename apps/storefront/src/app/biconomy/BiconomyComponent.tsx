"use client";
import {
  useSendSponsoredTransaction,
  useSmartAccount,
  useUserOpWait,
} from "@biconomy/use-aa";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { encodeFunctionData, parseAbi } from "viem";
import { polygonAmoy } from "viem/chains";

export default function BiconomyComponent() {
  const { smartAccountAddress } = useSmartAccount();

  const {
    mutate,
    data: userOpResponse,
    error,
    isPending,
  } = useSendSponsoredTransaction();

  const {
    isLoading: waitIsLoading,
    isSuccess: waitIsSuccess,
    error: waitError,
    data: waitData,
  } = useUserOpWait(userOpResponse);

  const mintNftTx = () =>
    mutate({
      transactions: {
        to: "0x1758f42Af7026fBbB559Dc60EcE0De3ef81f665e",
        data: encodeFunctionData({
          abi: parseAbi(["function safeMint(address _to)"]),
          functionName: "safeMint",
          args: [smartAccountAddress],
        }),
      },
    });

  return (
    <div className="flex flex-col items-center gap-4">
      <ConnectButton />
      <div className="flex flex-col justify-center items-center">
        {smartAccountAddress ? smartAccountAddress == "0x" ? (
          "Not Connected"
        ) : (
          <div className="flex flex-col justify-center items-center">
            <div onClick={() => {console.log(smartAccountAddress == "0x")}}>Smart Account Address</div>
            <span className="mt-2">{smartAccountAddress}</span>
          </div>
        ) : (
          "Not Connected"
        )}
      </div>
      <button
        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        type="button"
        onClick={mintNftTx}
      >
        {waitIsLoading || isPending ? "Executing..." : "Mint an NFT"}
      </button>

      {waitIsSuccess && (
        <div>
          <a
            href={`${polygonAmoy.blockExplorers.default.url}/tx/${waitData?.receipt?.transactionHash}`}
          >
            View on Polygon Scan
          </a>
        </div>
      )}
    </div>
  );
}