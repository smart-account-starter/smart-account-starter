'use client';
import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { client } from "./client";
import { ThirdwebProvider } from 'thirdweb/react';

const ConnectButton = dynamic(
  () => import("thirdweb/react").then((mod) => mod.ConnectButton),
  { ssr: false }
);

export interface ConnectButtonWrapperRef {
  click: () => void;
}

const ConnectButtonWrapper = forwardRef<ConnectButtonWrapperRef>((props, ref) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    click: () => {
      const button = wrapperRef.current?.querySelector('button');
      if (button) {
        button.click();
      }
    },
  }));

  useEffect(() => {
    const button = wrapperRef.current?.querySelector('button');
    if (button) {
      button.click();
    }
  }, []);

  return (
    <div ref={wrapperRef}>
      <ThirdwebProvider>
      <ConnectButton
        client={client}
        appMetadata={{
          name: "Smart Account Starter",
          url: "https://smart-account-starter.vercel.app",
        }}
        />
      </ThirdwebProvider>
    </div>
  );
});

ConnectButtonWrapper.displayName = 'ConnectButtonWrapper';

export default ConnectButtonWrapper;