'use client'
import React, { useState } from 'react';
import SmartAcct, { AccountProvider, SignerProvider } from '@smartacct/sdk';

const DemoComponent: React.FC = () => {
  const [accountAddress, setAccountAddress] = useState<string | null>(null);

  const createAccount = async () => {
    // For this example, we'll use 'zerodev' as the account provider and 'privy' as the signer provider
    const accountProvider: AccountProvider = 'zerodev';
    const signerProvider: SignerProvider = 'privy';

    const signer = {
      type: signerProvider,
    };

    const smartAcct = new SmartAcct(accountProvider, signer);

    try {
      const address = await smartAcct.createAccount();
      setAccountAddress(address);
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  return (
    <div>
      <h1>Smart Account Demo</h1>
      <button onClick={createAccount}>Create Account</button>
      {accountAddress && <p>Account created: {accountAddress}</p>}
    </div>
  );
};

export default DemoComponent;
