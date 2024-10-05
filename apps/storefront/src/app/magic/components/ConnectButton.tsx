"use client"
import { useEffect, useRef, useState } from "react"
import { useMagic } from "../context/MagicProvider"
import { useUser } from "../context/UserContext"

const ConnectButton = () => {
  const { magic } = useMagic()
  const { fetchUser } = useUser()
  const [isConnecting, setIsConnecting] = useState(false)
  const hasAttemptedConnect = useRef(false)

  const handleConnect = async () => {
    if (!magic) {
      console.log("Magic not yet available")
      return
    }
    setIsConnecting(true)
    try {
      console.log('Connecting with Magic wallet')
      await magic.wallet.connectWithUI()
      await fetchUser()
      console.log("Connected to wallet")
    } catch (error) {
      console.error("handleConnect:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  useEffect(() => {
    if (magic && !hasAttemptedConnect.current) {
      hasAttemptedConnect.current = true
      handleConnect()
    }
  }, [magic])

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
