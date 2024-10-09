"use client"
import {
  ConnectButton,
  DisconnectButton,
  ShowUIButton,
  SignMessage,
  WalletDetail,
} from "./components/index"
import { useUser } from "./context/UserContext"
import SendTransaction from "./components/SendTransaction"
import MagicProvider from "./context/MagicProvider"

export default function Home() {
  const { user } = useUser()
  console.log('user', user)
  return (
    <main>
      <MagicProvider>

      <h1>Magic Link</h1>
      {user ? (
        <div className="p-2 flex flex-col w-[40vw] mx-auto">
          <WalletDetail />
          <ShowUIButton />
          <SendTransaction />
          <SignMessage />
          <DisconnectButton />
        </div>
      ) : (
          <ConnectButton />
      )}
      </MagicProvider>
    </main>
  )
}
