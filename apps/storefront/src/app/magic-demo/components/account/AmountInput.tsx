interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  onSetMax: () => void;
  insufficientBalance: boolean;
  feeEstimate: string | null;
  isLoadingEstimateFees: boolean;
  hideWarnings?: boolean;
}

function AmountInput({
  value,
  onChange,
  onSetMax,
  insufficientBalance,
  feeEstimate,
  isLoadingEstimateFees,
  hideWarnings,
}: AmountInputProps) {
  console.log("hideWarnings", hideWarnings);
  console.log("isLoadingEstimateFees", isLoadingEstimateFees);
  console.log("feeEstimate", feeEstimate);
  console.log("insufficientBalance", insufficientBalance);
  return (
    <div>
      <label
        htmlFor="amount"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Amount
      </label>
      <div className="relative">
        <input
          type="number"
          id="amount"
          className="w-full p-3 pr-16 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="0"
          onChange={(e) => onChange(e.target.value)}
          value={value}
          min="0"
          step="any"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button
            type="button"
            onClick={onSetMax}
            className="text-sm text-blue-600 font-medium hover:text-blue-800"
            disabled={isLoadingEstimateFees}
          >
            Max
          </button>
        </div>
      </div>
      {insufficientBalance && !hideWarnings && (
        <p className="mt-1 text-sm text-red-600">Insufficient balance.</p>
      )}
      {feeEstimate && !isLoadingEstimateFees && !hideWarnings && (
        <p className="mt-1 text-sm text-gray-600">
          Estimated fee: ${feeEstimate} USDC
        </p>
      )}
      {isLoadingEstimateFees && !hideWarnings && (
        <p className="mt-1 text-sm text-gray-600">Estimating fee...</p>
      )}
    </div>
  );
}

export default AmountInput;
