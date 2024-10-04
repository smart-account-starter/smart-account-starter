import { DynamicContextProvider, DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

function App() {
  return <DynamicContextProvider
    settings={{
      environmentId: process.env.NEXT_PUBLIC_DYNAMIC_LABS_ENVIRONMENT_ID ?? '',
      walletConnectors: [ EthereumWalletConnectors ],
    }}>
    <DynamicWidget />
  </DynamicContextProvider>
}

export default App;
