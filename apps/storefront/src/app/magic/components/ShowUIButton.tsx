import { useMagic } from "../context/MagicProvider"

const ShowUIButton = () => {
  const { magic } = useMagic()

  // Define the event handler for the button click
  const handleShowUI = async () => {
    try {
      // Try to show the magic wallet user interface
      await magic?.wallet.showUI()
    } catch (error) {
      // Log any errors that occur during the process
      console.error("handleShowUI:", error)
    }
  }

  // Render the button component if showButton is true, otherwise render nothing
  return (
    <button
      className="w-auto border border-white font-bold p-2 rounded-md text-color"
      onClick={handleShowUI}
    >
      Show UI
    </button>
  )
}

export default ShowUIButton
