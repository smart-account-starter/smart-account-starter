'use client';
import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { client } from "./client";
import { ThirdwebProvider, useActiveAccount } from 'thirdweb/react';

const ConnectButton = dynamic(
  () => import("thirdweb/react").then((mod) => mod.ConnectButton),
  { ssr: false }
);

const ConnectEmbed = dynamic(
  () => import("thirdweb/react").then((mod) => mod.ConnectEmbed),
  { ssr: false }
);


export interface ConnectButtonWrapperRef {
  click: () => void;
}

const ConnectButtonWrapper = forwardRef<ConnectButtonWrapperRef>((props, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    click: () => {
      setIsModalOpen(true);
    },
  }));

  const closeModal = () => {
    setIsModalOpen(false);
  };

  console.log(client);
  const activeAccount = useActiveAccount();
  console.log(activeAccount);

  return (
    <div ref={wrapperRef}>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              {activeAccount ? (
                <ConnectButton
                  client={client}
                  appMetadata={{
                    name: "Example App",
                    url: "https://example.com",
                  }}
                />
              ) : (
                <ConnectEmbed
                  client={client}
                  appMetadata={{
                    name: "Smart Account Starter",
                    url: "https://smart-account-starter.vercel.app",
                  }}
                />
              )}
        </div>
      )}
    </div>
  );
});

ConnectButtonWrapper.displayName = 'ConnectButtonWrapper';

export default ConnectButtonWrapper;