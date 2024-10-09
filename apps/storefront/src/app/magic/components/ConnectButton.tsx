"use client"
import { useEffect, useRef, useState } from "react"
import { useMagic } from "../context/MagicProvider"
import { useUser } from "../context/UserContext"

const ConnectButton = () => {
  const { magic } = useMagic()
  const { user, fetchUser } = useUser()
  const [isConnecting, setIsConnecting] = useState(false)
  const hasAttemptedConnect = useRef(false)
  const [metadata, setMetadata] = useState<any>(null)
  const handleConnect = async () => {
    if (!magic) {
      console.log("Magic not yet available")
      return
    }
    setIsConnecting(true)
    console.log(await fetchUser())
    try {
      console.log('Connecting with Magic wallet')
      await magic.wallet.connectWithUI()
      // await fetchUser()
      console.log("Connected to wallet")
  // console.log(await useUser().fetchUser())
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

  // console.log(useMagic())
  // console.log(fetchUser())

  const fetchMetadata = async () => {
    const metadata = await magic?.user.getInfo();
    setMetadata(metadata)
    console.log('User metadata:', metadata);
  };

  if (user) {
    return (
      <button
        type="button"
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-block"
        disabled
      >
        Connected
      </button>
    )
  }

  console.log('metadata', metadata)

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
