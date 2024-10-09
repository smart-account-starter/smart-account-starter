"use client"

import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core"
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum"
import { ReactNode } from "react"

interface DynamicContextProviderWrapperProps {
  children: ReactNode
}

export function DynamicContextProviderWrapper({ children }: DynamicContextProviderWrapperProps) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_LABS_ENVIRONMENT_ID ?? "",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      {children}
    </DynamicContextProvider>
  )
}