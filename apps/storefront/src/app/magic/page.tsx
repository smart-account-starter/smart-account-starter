"use client"
import { useMagic } from "./context/MagicProvider"
import MagicProvider from "./context/MagicProvider"
import ConnectButton from "./components/ConnectButton"
import WalletDetail from "./components/WalletDetail"
import ShowUIButton from "./components/ShowUIButton"
import SendTransaction from "./components/SendTransaction"
import SignMessage from "./components/SignMessage"
import DisconnectButton from "./components/DisconnectButton"
import { useState } from "react"

export default function MagicPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <MagicProvider>
        <MagicContent />
      </MagicProvider>
    </main>
  )
}

function MagicContent() {
  const { isLoggedIn } = useMagic()

  if (isLoggedIn === null) {
    return <div>Loading...</div>
  }

  const [, setIsLoggedIn] = useState(false);

  const handleDisconnect = () => {
    // Assuming the DisconnectButton component handles the actual disconnection
    setIsLoggedIn(false)
  }

  return (
    <>
      {isLoggedIn ? (
        <div className="p-2 flex flex-col w-[40vw] mx-auto">
          <WalletDetail />
          <ShowUIButton />
          <SendTransaction />
          <SignMessage />
          <DisconnectButton onDisconnect={handleDisconnect} />
        </div>
      ) : (
        <ConnectButton />
      )}
    </>
  )
}
