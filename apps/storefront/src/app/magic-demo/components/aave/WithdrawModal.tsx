import { useState, useEffect } from "react";
import Modal from "../Modal";
import { formatUnits, parseUnits } from "viem";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { useAaveWithdraw } from "../../hooks/useAaveWithdraw";
import { Position } from "../../hooks/useAavePositions";
import { chainNameFromId, getChainIcon } from "../../utils/utils";
import { useReadCab } from "@zerodev/magic-account";
import { useAavePositions } from "../../hooks/useAavePositions";

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
  position: Position;
}

function WithdrawModal({ open, onClose, position }: WithdrawModalProps) {
  const [amount, setAmount] = useState("");
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const { refetch: refetchPositions } = useAavePositions();
  const { refetch: refetchCab } = useReadCab();

  const { withdraw, isLoading } = useAaveWithdraw({
    onSuccess: (userOpHash) => {
      console.log("Withdrawal successful, userOpHash:", userOpHash);
      toast.success(
        <div className="flex flex-col items-start space-y-2 text-sm">
          <span className="font-semibold text-green-600">
            Withdrawal successful!
          </span>
          <div className="flex items-center space-x-2">
            <span>View details:</span>
            <a
              href={`https://jiffyscan.xyz/userOpHash/${userOpHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-200"
            >
              Transaction Details
            </a>
          </div>
        </div>,
        {
          position: "bottom-right",
          autoClose: 15000,
        }
      );
      setTimeout(() => {
        refetchPositions();
      }, 1000);
      refetchCab();
      onClose();
    },
  });

  useEffect(() => {
    if (open) {
      setAmount("");
      setInsufficientBalance(false);
    }
  }, [open]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || parseFloat(value) >= 0) {
      setAmount(value);
      setInsufficientBalance(parseFloat(value) > parseFloat(position.amount));
    }
  };

  const handleMaxClick = () => {
    setAmount(position.amount);
    setInsufficientBalance(false);
  };

  const handleWithdraw = () => {
    if (!amount || insufficientBalance) return;

    withdraw({
      chainId: position.chainId,
      amount,
    });
  };

  return (
    <Modal open={open} handleClose={onClose} showPoweredBy={false}>
      <h2 className="text-2xl font-semibold mb-6">Withdraw from Aave</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Market
          </label>
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <img
              src={getChainIcon(position.chainId)}
              alt={chainNameFromId(position.chainId)}
              className="w-6 h-6 mr-2"
            />
            <span className="font-medium">
              {chainNameFromId(position.chainId)}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Asset
          </label>
          <div className="p-3 bg-blue-50 rounded-lg">
            <span className="font-medium">{position.token}</span>
          </div>
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount to Withdraw
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              className="w-full p-3 pr-16 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
              value={amount}
              onChange={handleAmountChange}
              min="0"
              step="any"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="font-medium">{position.token}</span>
            </div>
          </div>
          {insufficientBalance && (
            <p className="mt-1 text-sm text-red-600">Insufficient balance.</p>
          )}
          <div className="mt-1 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Available: {formatUnits(parseUnits(position.amount, 6), 6)}{" "}
              {position.token}
            </p>
            <button
              onClick={handleMaxClick}
              className="text-sm text-blue-600 font-medium hover:text-blue-800"
            >
              Max
            </button>
          </div>
        </div>
      </div>

      <Button
        variant="contained"
        sx={{ textTransform: "none", mt: 4, borderRadius: "1rem" }}
        fullWidth
        onClick={handleWithdraw}
        disabled={isLoading || !amount || insufficientBalance}
      >
        {isLoading ? "Withdrawing..." : "Withdraw"}
      </Button>
    </Modal>
  );
}

export default WithdrawModal;
