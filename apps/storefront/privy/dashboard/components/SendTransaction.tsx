'use client'
import React, { useState, useEffect } from 'react';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { base, sepolia } from 'viem/chains';
import type { Chain } from 'viem';
export default function SendTransaction({ onClose }: { onClose: () => void }) {
  const { client } = useSmartWallets();
  const [signature, setSignature] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const SAMPLE_RECIPIENT_ADDRESS = '0x21Dd4f02fCA6Fb13989147c919331C3C3a6945b2';

  useEffect(() => {
    async function sendTransaction() {
      try {
        const hash = await client?.sendTransaction({
          account: client.account,
          chain: base as Chain as any,
          to: SAMPLE_RECIPIENT_ADDRESS,
          value: BigInt(0.1 * 1e18), // Convert to wei and then to BigInt
        });
        setTxHash(hash ?? null);
        
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

    sendTransaction();
  }, [client, onClose]);

  return (
    <>
      <p>Signature: {signature ?? 'No signature'}</p>
      <p>Tx Hash: {txHash ?? 'No tx hash'}</p>
    </>
  )
}
