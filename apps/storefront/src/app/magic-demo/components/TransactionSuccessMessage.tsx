interface TransactionSuccessMessageProps {
  message: string;
  userOpHash: string;
}

function TransactionSuccessMessage({ message, userOpHash }: TransactionSuccessMessageProps) {
  return (
    <div className="flex flex-col items-start space-y-2 text-sm">
      <span className="font-semibold text-green-600">{message}</span>
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
    </div>
  );
};

export default TransactionSuccessMessage;