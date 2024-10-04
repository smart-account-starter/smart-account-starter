'use client';

import { PrivyProvider } from "@privy-io/react-auth";
import {SmartWalletsProvider} from '@privy-io/react-auth/smart-wallets';


export default function PrivyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[100vh] flex-col">
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
        config={{
          embeddedWallets: {
            createOnLogin: "all-users",
          },
          // Add other configuration options as needed
        }}
      >
     <SmartWalletsProvider>
        {children}
      </SmartWalletsProvider>
      </PrivyProvider>
    </div>
  );
}
