import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Transition } from "@headlessui/react";
import { tokens, getChainIcon } from "../../utils/utils";
import { useAaveYieldInfo } from "../../hooks/useAaveYieldInfo";
import { chains } from "../../utils/utils";
interface UsdcSaveModalProps {
  isVisible: boolean;
  transferPending: boolean;
  tokenSymbol: string;
  tokenAddress: string;
  apy: number;
  chainName: string;
  chainId: number;
  marketAddress: string;
  balances: {
    usdc: string;
    usdt: string;
  };
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void;
}

function UsdcSaveModal({
  isVisible,
  transferPending,
  tokenSymbol,
  tokenAddress,
  apy,
  chainName,
  chainId,
  marketAddress,
  balances,
  onClose,
  onSubmit,
}: UsdcSaveModalProps) {
  const { register, handleSubmit, setValue, watch } = useForm();
  const { data: yieldInfo } = useAaveYieldInfo(tokenSymbol as "USDC");
  const [selectedChain, setSelectedChain] = useState({
    name: chainName,
    id: chainId,
  });
  const [maxBalance, setMaxBalance] = useState("0");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const amount = watch("amount");
  const [currentYield, setCurrentYield] = useState<number>(apy);

  useEffect(() => {
    // Set default values when the component loads
    setValue("chainId", chainId);
    setValue("chainName", chainName);
    setValue("tokenAddress", tokenAddress);
    setValue("marketAddress", marketAddress);
    setCurrentYield(apy);
  }, [chainId, chainName, tokenAddress, marketAddress, apy, setValue]);

  useEffect(() => {
    const result =
      tokenSymbol === "USDC"
        ? parseFloat(balances.usdc)
        : parseFloat(balances.usdt);
    if (result === 0) {
      setMaxBalance("0");
    } else {
      const buffer = 0.1;
      const reducedResult = result - buffer;
      setMaxBalance(reducedResult <= 0 ? "0" : reducedResult.toFixed(2));
    }
  }, [balances, tokenSymbol]);

  const setNewChain = (id: number) => {
    const selected = chains.find((chain) => chain.id === id);
    if (selected) {
      setSelectedChain({ name: selected.name, id: selected.id });
      const newYieldInfo = yieldInfo?.find((info) => info.chainId === id);
      if (newYieldInfo) {
        setCurrentYield(newYieldInfo.supplyYield);
        setValue("chainId", id);
        setValue("chainName", selected.name);
        setValue("tokenAddress", newYieldInfo.tokenAddress);
        setValue("marketAddress", newYieldInfo.marketAddress);
      }
    }
    toggleDropdown();
  };

  const setMaxAvailable = () => {
    setValue("amount", maxBalance);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSubmit = (data: any) => {
    onSubmit(data);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <span>Supply {tokenSymbol}</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <input type="hidden" {...register("chainId")} />
        <input type="hidden" {...register("chainName")} />
        <div className="w-full">
          <div className="relative">
            <div
              onClick={toggleDropdown}
              className="w-full flex flex-row items-center gap-x-2 text-sm justify-between cursor-pointer"
            >
              <div className="flex items-center">
                <img
                  src={getChainIcon(selectedChain.id).src}
                  alt={selectedChain.name}
                  className="h-6 w-6 mr-2"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-xs text-slate-600">
                    Select Aave Market
                  </span>
                  <span>{selectedChain.name}</span>
                </div>
              </div>
              <div className="flex flex-row items-center px-4 text-sm py-3 bg-slate-50 hover:bg-slate-100 rounded-md justify-end gap-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-down-up h-5 w-5"
                >
                  <path d="m3 16 4 4 4-4" />
                  <path d="M7 20V4" />
                  <path d="m21 8-4-4-4 4" />
                  <path d="M17 4v16" />
                </svg>
              </div>
            </div>

            <Transition
              show={isDropdownOpen}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <div className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {chains.map((chain) => (
                    <div
                      key={chain.id}
                      onClick={() => setNewChain(chain.id)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                    >
                      <img
                        src={getChainIcon(chain.id).src}
                        alt={chain.name}
                        className="h-5 w-5 mr-2"
                      />
                      {chain.name}
                    </div>
                  ))}
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <div className="bg-gray-50 grid grid-cols-2 rounded p-6 text-slate-700 gap-x-4 gap-y-10 text-sm">
          <div className="flex items-center">
            <div className="flex flex-col">
              <span className="font-semibold text-xs text-slate-600">
                Savings APY
              </span>
              <span className="text-green-600 font-semibold">
                {(currentYield * 100).toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <img
              src={tokens.find((token) => token.symbol === "USDC")?.logo.src}
              alt="USDC Logo"
              className="h-5 w-5 mr-2"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-xs text-slate-600">
                Token
              </span>
              <span className="font-mono">{tokenSymbol}</span>
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount to supply:
          </label>
          <div className="relative mt-2 rounded-md shadow-sm">
            <input
              id="amount"
              {...register("amount", {
                required: true,
                min: 0,
                max: parseFloat(maxBalance),
                valueAsNumber: true,
                validate: (value) => {
                  const numValue = parseFloat(value);
                  return !isNaN(numValue) && numValue <= parseFloat(maxBalance);
                },
              })}
              type="text"
              placeholder="0.00"
              aria-describedby="amount-currency"
              className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span id="amount-currency" className="text-gray-500 sm:text-sm">
                {tokenSymbol}
              </span>
            </div>
          </div>
          <div className="my-2 w-full flex justify-end text-xs text-slate-600 font-normal">
            <div
              onClick={setMaxAvailable}
              className="underline cursor-pointer mr-1"
            >
              Max available
            </div>
            ({maxBalance})
          </div>
          {/* <Alert
            text="Max available amount is smaller than your balance to account for transaction costs."
            showDetails={false}
          /> */}
        </div>

        <div className="grid grid-cols-2 items-center justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="button-secondary flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <div className="mt-[0.1rem]">Cancel</div>
          </button>
          <button
            type="submit"
            disabled={!amount || transferPending}
            className="button-primary flex items-center justify-center"
          >
            {transferPending ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-indigo-200"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            <div className="mt-[0.1rem]">
              {transferPending ? "Processing" : "Confirm"}
            </div>
          </button>
        </div>
      </form>
      {/* </div> */}
    </>
  );
}

export default UsdcSaveModal;
