"use client"
import { Magic } from "magic-sdk"
import type {
  ReactNode} from "react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
const { Web3 } = require("web3")

interface UserMetadata {
  email?: string;
  publicAddress?: string;
  // Add other metadata fields as needed
}

interface MagicContextType {
  magic: Magic | null
  web3: typeof Web3 | null
  userMetadata: UserMetadata | null
  updateUserMetadata: () => Promise<void>
}

const MagicContext = createContext<MagicContextType>({
  magic: null,
  web3: null,
  userMetadata: null,
  updateUserMetadata: async () => {},
})

export const useMagic = () => {
  return useContext(MagicContext)
}

function MagicProvider({ children }: { children: ReactNode }) {
  const [magic, setMagic] = useState<Magic | null>(null)
  const [web3, setWeb3] = useState<typeof Web3 | null>(null)
  const [userMetadata, setUserMetadata] = useState<UserMetadata | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MAGIC_API_KEY) {
      const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY || "", {
        network: {
          rpcUrl: "https://rpc2.sepolia.org/",
          chainId: 11155111,
        },
      })

      setMagic(magic)
      setWeb3(new Web3((magic as any).rpcProvider))

      // Check if user is already logged in
      const checkLoginStatus = async () => {
        try {
          const loggedIn = await magic.user.isLoggedIn()
          setIsLoggedIn(loggedIn)
          if (loggedIn) {
            const metadata = await magic.user.getMetadata()
            setUserMetadata(metadata)
            console.log("User is already logged in. Metadata:", metadata)
          } else {
            console.log("User is not logged in")
          }
        } catch (error) {
          console.error("Error checking login status:", error)
        }
      }

      checkLoginStatus()
    } else {
      console.error("NEXT_PUBLIC_MAGIC_API_KEY is not set")
    }
  }, [])

  const updateUserMetadata = async () => {
    if (magic) {
      try {
        const metadata = await magic.user.getMetadata()
        setUserMetadata(metadata)
        setIsLoggedIn(true)
        console.log("Updated user metadata:", metadata)
      } catch (error) {
        console.error("Failed to fetch user metadata:", error)
        setUserMetadata(null)
        setIsLoggedIn(false)
      }
    }
  }

  const value = useMemo(() => {
    return {
      magic,
      web3,
      userMetadata,
      isLoggedIn,
      updateUserMetadata,
    }
  }, [magic, web3, userMetadata, isLoggedIn])

  return <MagicContext.Provider value={value}>{children}</MagicContext.Provider>
}

export default MagicProvider
