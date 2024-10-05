import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";
import { chains } from "../utils/constants";
import { getChainIcon } from "../utils/utils";

interface ChainSelectProps {
  selectedChainId: number;
  onChainSelect: (chainId: number) => void;
  className?: string;
  excludeBase?: boolean;
}

function ChainSelect({
  selectedChainId,
  onChainSelect,
  className = "",
  excludeBase = false,
}: ChainSelectProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const setNewChain = (chainId: number) => {
    onChainSelect(chainId);
    toggleDropdown();
  };

  return (
    <div className={`relative ${className}`}>
      <div
        onClick={toggleDropdown}
        className="flex items-center justify-between cursor-pointer p-3 bg-gray-100 rounded-lg hover:bg-gray-200"
      >
        <div className="flex items-center">
          <img
            src={getChainIcon(selectedChainId) ?? ""}
            alt={chains[selectedChainId as keyof typeof chains].chain.name}
            className="w-6 h-6 mr-2"
          />
          <span className="font-medium">
            {chains[selectedChainId as keyof typeof chains].chain.name}
          </span>
        </div>
        <ChevronDownIcon className="h-5 w-5" />
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
        <div className="absolute z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {Object.entries(chains).map(([chainId, chain]) => {
              if (excludeBase && Number(chainId) === 8453) return null;
              return (
                <div
                  key={chainId}
                  onClick={() => setNewChain(Number(chainId))}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                >
                  <img
                    src={getChainIcon(Number(chainId)) ?? ""}
                    alt={chain.chain.name}
                    className="h-5 w-5 mr-2"
                  />
                  {chain.chain.name}
                </div>
              );
            })}
          </div>
        </div>
      </Transition>
    </div>
  );
}

export default ChainSelect;
