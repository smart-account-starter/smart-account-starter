'use client'
import { DynamicContextProvider, DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Automatically click the Dynamic Widget button on page load
    const dynamicButton = document.querySelector('.dynamic-widget-button') as HTMLButtonElement;
    if (dynamicButton) {
      dynamicButton.click();
    }
  }, []);

  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_LABS_ENVIRONMENT_ID ?? '',
        walletConnectors: [ EthereumWalletConnectors ],
      }}
    >
      <DynamicWidget />
    </DynamicContextProvider>
  );
}

export default App;
