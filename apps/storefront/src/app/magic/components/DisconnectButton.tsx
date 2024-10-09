import { useMagic } from "../context/MagicProvider"
import { useState } from "react"
import { useUser } from "../context/UserContext"

interface DisconnectButtonProps {
  onDisconnect: () => void
}

export default function DisconnectButton({ onDisconnect }: DisconnectButtonProps) {
  const { magic } = useMagic()

  const handleDisconnect = async () => {
    try {
      await magic.user.logout()
      onDisconnect()
    } catch (error) {
      console.error("Error during disconnect:", error)
    }
  }

  return (
    <button onClick={handleDisconnect} className="btn btn-primary">
      Disconnect
    </button>
  )
}
