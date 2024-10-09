'use client';
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";

import { PrivyProvider } from "@privy-io/react-auth";
import { base, baseGoerli, mainnet, polygon, polygonMumbai, sepolia } from "viem/chains";

export function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        loginMethods: ['email', 'sms', 'wallet', 'google', 'twitter', 'github', 'linkedin'],
        defaultChain: base, 
        supportedChains: [mainnet, sepolia, base, baseGoerli, polygon, polygonMumbai],
        embeddedWallets: {
          createOnLogin: "all-users",
          // Replace this with a list of your desired supported chains

        },
        // Add other configuration options as needed
      }}
    >
      <SmartWalletsProvider>{children}</SmartWalletsProvider>
    </PrivyProvider>
  );
}
