'use client'
import { DynamicContextProvider, DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { useEffect, useState } from 'react';

function DynamicContent() {
  const { handleShowAuthFlow, isInitialized } = useDynamicContext();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isInitialized) {
      console.log("Dynamic SDK initialized, attempting to show auth flow");
      handleShowAuthFlow().catch((err) => {
        console.error("Error showing auth flow:", err);
        setError("Failed to show auth flow");
      });
    } else {
      console.log("Dynamic SDK not yet initialized");
    }
  }, [handleShowAuthFlow, isInitialized]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <DynamicWidget />;
}

function App() {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_LABS_ENVIRONMENT_ID ?? '',
        walletConnectors: [ EthereumWalletConnectors ],
      }}
    >
      <DynamicContent />
    </DynamicContextProvider>
  );
}

export default App;
