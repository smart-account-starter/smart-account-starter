import { useEffect, useMemo, useState } from "react"
import { useMagic } from "../context/MagicProvider"
import { useUser } from "../context/UserContext"

const WalletDetail = () => {
  // Use the Web3Context to get the current instance of web3
  const { web3 } = useMagic()
  const { user } = useUser()

  // Initialize state variable for balance
  const [balance, setBalance] = useState("...")

  useEffect(() => {
    const getBalance = async () => {
      if (!user?.address || !web3) return
      try {
        // If account and web3 are available, get the balance
        const balance = await web3.eth.getBalance(user?.address)

        // Convert the balance from Wei to Ether and set the state variable
        setBalance(web3.utils.fromWei(balance, "ether").substring(0, 7))
      } catch (error) {
        console.error(error)
      }
    }

    getBalance()
  }, [web3, user])

  // Render the account address and balance
  return (
    <div>
      <p>Address: {user?.address}</p>
      <p>Balance: {balance} ETH</p>
    </div>
  )
}

export default WalletDetail
