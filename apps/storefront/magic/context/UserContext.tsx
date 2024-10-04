"use client"
import React, { createContext, useContext, useEffect, useState } from "react"
import { useMagic } from "./MagicProvider"

// Define the type for the user
type User = {
  address: string
}

// Define the type for the user context.
type UserContextType = {
  user: User | null
  fetchUser: () => Promise<void>
}

// Create a context for user data.
const UserContext = createContext<UserContextType>({
  user: null,
  fetchUser: async () => {},
})

// Custom hook for accessing user context data.
export const useUser = () => useContext(UserContext)

// Provider component that wraps parts of the app that need user context.
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  // Use the web3 context.
  const { web3 } = useMagic()

  // Initialize user state to hold user's account information.
  const [address, setAddress] = useState<string | null>(null)

  // Function to retrieve and set user's account.
  const fetchUserAccount = async () => {
    // Use Web3 to get user's accounts.
    const accounts = await web3?.eth.getAccounts()

    // Update the user state with the first account (if available), otherwise set to null.
    setAddress(accounts ? accounts[0] : null)
  }

  // Run fetchUserAccount function whenever the web3 instance changes.
  useEffect(() => {
    fetchUserAccount()
  }, [web3])

  return (
    <UserContext.Provider
      value={{
        user: address ? { address: address } : null,
        fetchUser: fetchUserAccount,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
