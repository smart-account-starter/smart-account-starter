"use client"
import { useEffect, useRef, useState } from "react"
import { useMagic } from "../context/MagicProvider"
import { useUser } from "../context/UserContext"

const ConnectButton = () => {
  const { magic, userMetadata, isLoggedIn, updateUserMetadata } = useMagic()
  const { user, fetchUser } = useUser()
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    if (isLoggedIn === true && !userMetadata) {
      updateUserMetadata()
    }
  }, [isLoggedIn, userMetadata])

  const handleConnect = async () => {
    if (!magic) {
      console.log("Magic not yet available")
      return
    }
    setIsConnecting(true)
    try {
      if (!isLoggedIn) {
        console.log('Connecting with Magic wallet')
        await magic.wallet.connectWithUI()
      }
      await fetchUser()
      await updateUserMetadata()
      console.log("Connected to wallet")
    } catch (error) {
      console.error("handleConnect:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  useEffect(() => {
    console.log('Current userMetadata:', userMetadata)
    console.log('Is user logged in?', isLoggedIn)
  }, [userMetadata, isLoggedIn])

  if (isLoggedIn === true && userMetadata) {
    return (
      <button
        type="button"
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-block"
        disabled
      >
        Connected ({userMetadata.email})
      </button>
    )
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
