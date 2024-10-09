"use client"
import { useState } from "react"
import { useMagic } from "../context/MagicProvider"

const ConnectButton = () => {
  const { magic, updateUserMetadata } = useMagic()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    if (!magic) {
      console.log("Magic not yet available")
      return
    }
    setIsConnecting(true)
    try {
      console.log('Connecting with Magic wallet')
      await magic.wallet.connectWithUI()
      await updateUserMetadata()
      console.log("Connected to wallet")
    } catch (error) {
      console.error("handleConnect:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <button
      type="button"
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-block"
      onClick={handleConnect}
      disabled={isConnecting}
    >
      {isConnecting ? 'Connecting...' : 'Connect'}
    </button>
  )
}

export default ConnectButton
