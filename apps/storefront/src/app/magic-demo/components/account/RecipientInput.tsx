interface RecipientInputProps {
  value: string;
  onChange: (value: string) => void;
  isValidAddress: boolean | null;
}

function RecipientInput({ value, onChange, isValidAddress }: RecipientInputProps) {
  return (
    <div>
      <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
        To
      </label>
      <input
        type="text"
        id="recipient"
        className={`w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
          isValidAddress === false ? "border-red-500" : "border-gray-300"
        }`}
        placeholder="Search or enter address"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {isValidAddress === false && (
        <p className="mt-1 text-sm text-red-600">Invalid address.</p>
      )}
    </div>
  );
}

export default RecipientInput;