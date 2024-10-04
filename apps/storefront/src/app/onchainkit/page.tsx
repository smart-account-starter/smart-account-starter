"use client"
import { useAccount } from "wagmi"
import Footer from "./components/Footer"
import WalletWrapper from "./components/WalletWrapper"
import TransactionWrapper from "./components/TransactionWrapper"
import SignupButton from "./components/SignupButton"
import LoginButton from "./components/LoginButton"
import OnchainkitSvg from "./onChainkitSvg"

export default function Page() {
  const { address } = useAccount()

  return (
    <div>
      <h1>Onchainkit</h1>
      <SignupButton />
      {!address && <LoginButton />}
      {address ? (
        <TransactionWrapper address={address} />
      ) : (
        <WalletWrapper
          className="w-[450px] max-w-full"
          text="Sign in to transact"
        />
      )}
    </div>
  )
}
