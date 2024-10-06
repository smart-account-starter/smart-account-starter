import React from "react";
import ConnectButtonWrapper from "./ConnectButtonWrapper";
import { ThirdwebProvider } from "thirdweb/react";

export default function Home() {
  return (
    <>
      <ThirdwebProvider>
        <ConnectButtonWrapper />
      </ThirdwebProvider>
    </>
  );
}

