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

interface MagicContextType {
  magic: Magic | null
  web3: typeof Web3 | null
}

const MagicContext = createContext<MagicContextType>({
  magic: null,
  web3: null,
})

export const useMagic = () => {
  return useContext(MagicContext)
}

function MagicProvider({ children }: { children: ReactNode }) {
  const [magic, setMagic] = useState<Magic | null>(null)
  const [web3, setWeb3] = useState<typeof Web3 | null>(null)

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
    } else {
      console.error("NEXT_PUBLIC_MAGIC_API_KEY is not set")
    }
  }, [])

  const value = useMemo(() => {
    return {
      magic,
      web3,
    }
  }, [magic, web3])

  return <MagicContext.Provider value={value}>{children}</MagicContext.Provider>
}

export default MagicProvider
