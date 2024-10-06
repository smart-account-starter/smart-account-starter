"use client";
import { http } from "viem";
import "@rainbow-me/rainbowkit/styles.css";
import { BiconomyProvider } from "@biconomy/use-aa";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

if (
  !process.env.NEXT_PUBLIC_PAYMASTER_API_KEY ||
  !process.env.NEXT_PUBLIC_BUNDLER_URL
) {
  throw new Error("Missing env var");
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const paymasterApiKey = process.env.NEXT_PUBLIC_PAYMASTER_API_KEY || "";
  const bundlerUrl = process.env.NEXT_PUBLIC_BUNDLER_URL || "";

  const config = getDefaultConfig({
    appName: "Smart Account Starter",
    projectId: "smart-account-starter",
    chains: [polygonAmoy],
    ssr: true,
  });
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <BiconomyProvider
            config={{
              paymasterApiKey: paymasterApiKey,
              bundlerUrl,
            }}
            queryClient={queryClient}
          >
            {children}
          </BiconomyProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
