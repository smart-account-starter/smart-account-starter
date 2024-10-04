import { useMagic } from "../context/MagicProvider"
import { useState } from "react"
import { useUser } from "../context/UserContext"

const DisconnectButton = () => {
  const [isLoading, setIsLoading] = useState(false)
  // Get the initializeWeb3 function from the Web3 context
  const { magic } = useMagic()
  const { fetchUser } = useUser()

  // Define the event handler for the button click
  const handleDisconnect = async () => {
    try {
      setIsLoading(true)
      // Try to disconnect the user's wallet using Magic's logout method
      await magic?.user.logout()
      await fetchUser()

      setIsLoading(false)
    } catch (error) {
      // Log any errors that occur during the disconnection process
      console.log("handleDisconnect:", error)
    }
  }

  // Render the button component with the click event handler
  return (
    <button
      type="button"
      className="border border-white font-bold p-2 rounded-md text-color"
      onClick={handleDisconnect}
    >
      {isLoading ? "Disconnecting..." : "Disconnect"}
    </button>
  )
}

export default DisconnectButton
