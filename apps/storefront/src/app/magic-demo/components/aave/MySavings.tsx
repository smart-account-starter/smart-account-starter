import { useState } from "react";
import { chainNameFromId, getChainIcon } from "../../utils/utils";
import { useAavePositions, Position } from "../../hooks/useAavePositions";
import { useAaveYieldInfo } from "../../hooks/useAaveYieldInfo";
import WithdrawModal from "./WithdrawModal";

function MySavings() {
  const { data } = useAavePositions();
  const { data: yieldInfo } = useAaveYieldInfo();
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );

  const openWithdraw = async (position: Position) => {
    setSelectedPosition(position);
    setWithdrawModalOpen(true);
  };

  const parseNumber = (num: string) => parseFloat(num).toFixed(2);

  if ((data?.positions?.length ?? 0) === 0) {
    return null;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 bg-white rounded-3xl shadow-md p-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            My Savings
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Total USDC saved: {parseNumber(data?.totals.usdc || "0")}
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Market
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Asset
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Supplied Amount
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    APY
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Withdraw</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data?.positions?.map((pos, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="h-11 w-11 flex-shrink-0">
                          <img
                            className="h-11 w-11 rounded-full"
                            src={getChainIcon(pos.chainId)}
                            alt={chainNameFromId(pos.chainId)}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {chainNameFromId(pos.chainId)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <div className="text-gray-900">{pos.token}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      {parseNumber(pos.amount)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      {(
                        (yieldInfo?.find((info) => info.chainId === pos.chainId)
                          ?.supplyYield ?? 0) * 100
                      ).toFixed(2)}
                      %
                    </td>
                    <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <button
                        onClick={() => openWithdraw(pos)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Withdraw<span className="sr-only">, {pos.token}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {selectedPosition && (
        <WithdrawModal
          open={withdrawModalOpen}
          onClose={() => setWithdrawModalOpen(false)}
          position={selectedPosition}
        />
      )}
    </div>
  );
}

export default MySavings;
