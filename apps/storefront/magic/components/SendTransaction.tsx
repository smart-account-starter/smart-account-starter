import { useCallback, useState } from "react"
import { useMagic } from "../context/MagicProvider"

const SendTransaction = () => {
  const { web3 } = useMagic()
  const [toAddress, setToAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [hash, setHash] = useState<string | null>(null)

  const handleAddressInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setToAddress(e.target.value)

  const handleAmountInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAmount(e.target.value)

  const sendTransaction = useCallback(() => {
    const fromAddress = web3?.eth.getAccounts()?.[0]
    const isToAddressValid = web3?.utils.isAddress(toAddress)

    if (!fromAddress || !isToAddressValid || isNaN(Number(amount))) {
      // handle errors
    }

    const txnParams = {
      from: fromAddress,
      to: toAddress,
      value: web3.utils.toWei(amount, "ether"),
      gas: 21000,
    }
    web3.eth
      .sendTransaction(txnParams as any)
      .on("transactionHash", (txHash: string) => {
        setHash(txHash)
        console.log("Transaction hash:", txHash)
      })
      .then((receipt: any) => {
        setToAddress("")
        setAmount("")
        console.log("Transaction receipt:", receipt)
      })
      .catch(() => {
        // handle errors
      })
  }, [web3, amount, toAddress])

  // Render the component
  return (
    <div className="py-2 flex flex-col gap-2">
      <input
        className="text-black"
        type="text"
        onChange={handleAddressInput}
        maxLength={40}
        placeholder="Set Recipient Address"
      />
      <input
        className="text-black"
        type="text"
        onChange={handleAmountInput}
        maxLength={40}
        placeholder="Set Amount To Send"
      />
      <button
        type="button"
        className="border border-white font-bold p-2 rounded-md text-color"
        onClick={sendTransaction}
      >
        Send ETH
      </button>
      {hash && (
        <div className="w-[20vw] break-words mx-auto text-center">{`Tx Hash: ${hash}`}</div>
      )}
    </div>
  )
}

export default SendTransaction
