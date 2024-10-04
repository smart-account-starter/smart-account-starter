'use client';
import WalletWrapper from './WalletWrapper';

export default function SignupButton() {
  return (
    <WalletWrapper
      className="ockConnectWallet_Container bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-block"
      text="Sign up"
    />
  );
}
