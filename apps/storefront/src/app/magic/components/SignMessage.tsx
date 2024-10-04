import { useState } from "react"
import { useMagic } from "../context/MagicProvider"

const SignMessage = () => {
  // Use the MagicProvider to get the current instance of web3
  const { web3 } = useMagic()

  // Initialize state for message and signature
  const [message, setMessage] = useState("")
  const [signature, setSignature] = useState("")

  // Define the handler for input change, it updates the message state with input value
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMessage(e.target.value)

  // Define the signMessage function which is used to sign the message
  const handleSignMessage = async () => {
    const accounts = await web3?.eth.getAccounts()
    const address = accounts?.[0]
    if (address && web3) {
      try {
        // Sign the message using the connected wallet
        const signedMessage = await web3.eth.personal.sign(message, address, "")
        // Set the signature state with the signed message
        setSignature(signedMessage)
        // Do something with the signature
      } catch (error) {
        // Log any errors that occur during the signing process
        console.error("handleSignMessage:", error)
      }
    }
  }

  // Render the component
  return (
    <div className="py-2 flex flex-col gap-2">
      <input
        className="text-black"
        type="text"
        onChange={handleInput}
        maxLength={20}
        placeholder="Set Message"
      />
      <button
        type="button"
        className="border border-white font-bold p-2 rounded-md text-color"
        onClick={handleSignMessage}
      >
        Sign Message
      </button>
      {signature && (
        <div className="w-[20vw] break-words mx-auto text-center">{`Signature: ${signature}`}</div>
      )}
    </div>
  )
}

export default SignMessage
