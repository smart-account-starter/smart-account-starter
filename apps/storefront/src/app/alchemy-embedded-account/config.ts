import {
  AlchemyAccountsUIConfig,
  cookieStorage,
  createConfig,
} from "@account-kit/react";
import { sepolia } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [
      [{ type: "email" as const }],
      [{ type: "passkey" as const }, { type: "external_wallets" }],
    ],
    addPasskeyOnSignup: false,
  },
};

// TODO: insert your Alchemy API key - setup your app & embedded account configC
// read more about server side rendering (ssr) practices: https://accountkit.alchemy.com/react/ssr
// read more about persisting state with cookies: 
export const config = createConfig(
  {
    apiKey: process.env.ALCHEMY_API_KEY ?? '',
    chain: sepolia,
    ssr: true, 
    storage: cookieStorage, 
  },
  uiConfig
);

export const queryClient = new QueryClient();
