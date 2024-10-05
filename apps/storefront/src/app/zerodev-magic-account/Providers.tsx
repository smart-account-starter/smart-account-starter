import { AuthModalProvider } from "./providers/AuthModalProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { polygon, arbitrum, base, optimism } from "wagmi/chains";
import {
  passkeyConnector,
  wrapEOAConnector,
  googleConnector,
} from "@zerodev/magic-account";
import { SupplyModalProvider } from "./providers/SupplyModalProvider";
import { ToastContainer } from "react-toastify";

export default function Providers({ children }: { children: ReactNode }) {
  const config = createConfig({
    chains: [arbitrum, base, optimism, polygon],
    transports: {
      [optimism.id]: http(),
      [base.id]: http(),
      [arbitrum.id]: http(),
      [polygon.id]: http(),
    },
    connectors: [
      passkeyConnector(),
      wrapEOAConnector(injected()),
      googleConnector(),
    ],
    multiInjectedProviderDiscovery: false,
  });
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        <AuthModalProvider>
          <SupplyModalProvider>{children}</SupplyModalProvider>
        </AuthModalProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
