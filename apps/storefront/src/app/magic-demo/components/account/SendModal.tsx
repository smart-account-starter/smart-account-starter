import { useState, useEffect } from "react";
import Modal from "../Modal";
import { useReadCab } from "@zerodev/magic-account";
import { formatUnits } from "viem";
import ChainSelect from "../ChainSelect";
import { arbitrum } from "viem/chains";
import { tokenAddresses, tokenDecimals } from "../../utils/constants";
import { Button, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import TransactionSuccessMessage from "../TransactionSuccessMessage";
import { useEstimateFees } from "../../hooks/useEstimateFees";
import { useAddressValidation } from "../../hooks/useAddressValidation";
import { useSendErc20Token } from "../../hooks/useSendErc20Token";
import AmountInput from "./AmountInput";
import RecipientInput from "./RecipientInput";
import KeyIcon from "./KeyIcon";

interface SendModalProps {
  open: boolean;
  onClose: () => void;
}

function SendModal({ open, onClose }: SendModalProps) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const { data: cabBalance } = useReadCab({ refetchInterval: 1000 });
  const [selectedChainId, setSelectedChainId] = useState<number>(arbitrum.id);
  const { address } = useAccount();
  const [maxAmount, setMaxAmount] = useState<string | null>(null);
  const [insufficientBalance, setInsufficientBalance] = useState(false);

  const isValidAddress = useAddressValidation(recipient);
  const { baseFeeEstimate, feeEstimate, isLoadingEstimateFees } =
    useEstimateFees(selectedChainId, recipient, amount, address || "");

  useEffect(() => {
    if (cabBalance && baseFeeEstimate !== null) {
      const balance = Number(formatUnits(cabBalance, tokenDecimals.USDC));
      const maxAmountValue = balance - baseFeeEstimate;
      setMaxAmount(maxAmountValue > 0 ? maxAmountValue.toFixed(6) : "0");
    }
  }, [cabBalance, baseFeeEstimate]);

  useEffect(() => {
    if (cabBalance) {
      const balance = Number(formatUnits(cabBalance, tokenDecimals.USDC));
      const totalAmount = parseFloat(amount) + parseFloat(feeEstimate || "0");
      setInsufficientBalance(totalAmount > balance);
    }
  }, [cabBalance, amount, feeEstimate]);

  const handleSetMaxAmount = () => {
    if (maxAmount) {
      setAmount(maxAmount);
    }
  };

  const { sendToken, isLoading } = useSendErc20Token({
    onSuccess: (userOpHash) => {
      console.log("Token sent successfully, userOpHash:", userOpHash);
      toast.success(
        <TransactionSuccessMessage
          message="Send successful!"
          userOpHash={userOpHash}
        />,
        {
          position: "bottom-right",
          autoClose: 15000,
        }
      );
      setAmount("");
      setRecipient("");
      onClose();
    },
  });

  const handleSend = () => {
    if (!recipient || !amount || !selectedChainId) return;

    const tokenAddress = tokenAddresses[
      selectedChainId as keyof typeof tokenAddresses
    ]?.USDC as `0x${string}`;
    if (!tokenAddress) {
      console.error("USDC address not found for the selected chain");
      return;
    }

    sendToken({
      tokenAddress,
      toAddress: recipient as `0x${string}`,
      chainId: selectedChainId,
      amount,
      decimals: tokenDecimals.USDC,
    });
  };

  return (
    <Modal open={open} handleClose={onClose} showPoweredBy={false}>
      <h2 className="text-2xl font-semibold mb-6">Send</h2>

      <div className="space-y-4">
        {/* From address display */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From
          </label>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <KeyIcon />
              <span className="font-medium">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              $
              {cabBalance
                ? Number(formatUnits(cabBalance, tokenDecimals.USDC)).toFixed(6)
                : "0.00"}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From
          </label>
          <ChainSelect
            selectedChainId={selectedChainId}
            onChainSelect={(chainId) => {
              setSelectedChainId(chainId);
              setRecipient("");
            }}
          />
        </div>

        <RecipientInput
          value={recipient}
          onChange={setRecipient}
          isValidAddress={isValidAddress}
        />

        <AmountInput
          value={amount}
          onChange={setAmount}
          onSetMax={handleSetMaxAmount}
          insufficientBalance={insufficientBalance}
          feeEstimate={feeEstimate}
          isLoadingEstimateFees={isLoadingEstimateFees}
          hideWarnings={isLoading}
        />
      </div>

      <Button
        variant="contained"
        sx={{ textTransform: "none", mt: 2, borderRadius: "1rem" }}
        fullWidth
        onClick={handleSend}
        disabled={
          isLoading ||
          isLoadingEstimateFees ||
          isValidAddress === false ||
          !recipient ||
          !amount ||
          insufficientBalance ||
          !feeEstimate
        }
      >
        {isLoading ? (
          <>
            Sending...
            <CircularProgress size={20} color="inherit" sx={{ ml: 2 }} />
          </>
        ) : isLoadingEstimateFees ? (
          "Estimating Fees..."
        ) : (
          "Send"
        )}
      </Button>
    </Modal>
  );
}

export default SendModal;
