'use client'
import React, { useState, useEffect } from 'react';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { base, sepolia } from 'viem/chains';

export default function SignMessage({ onClose }: { onClose: () => void }) {
  const { client } = useSmartWallets();
  const [signature, setSignature] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const SAMPLE_RECIPIENT_ADDRESS = '0x21Dd4f02fCA6Fb13989147c919331C3C3a6945b2';

  useEffect(() => {
    async function signMessage() {
      try {
        const sig = await client?.signMessage({
          message: 'Hello world',
        });
        setSignature(sig ?? null);
        console.log(sig);

        // Wait a short time to allow state updates to complete
        setTimeout(() => {
          onClose();
        }, 1000);
      } catch (error) {
        console.error('Error:', error);
        // Close the modal even if there's an error
        onClose();
      }
    }

    signMessage();
  }, [client, onClose]);

  return (
    <>
      <p>Signature: {signature ?? 'No signature'}</p>
      <p>Tx Hash: {txHash ?? 'No tx hash'}</p>
    </>
  )
}
