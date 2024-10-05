import { useAccount } from "wagmi";
import { useEnableCab } from "@zerodev/magic-account";
import { useCallback, useEffect, useState } from "react";

export default function useAutoEnableCab() {
  const { enableCab, isEnabledOnCurrentChain, isPending } = useEnableCab();
  const { isConnected } = useAccount();
  const [isEnablingCab, setIsEnablingCab] = useState(false);

  const register = useCallback(async () => {
    try {
      if (!isEnabledOnCurrentChain("USDC")) {
        setIsEnablingCab(true);
        await enableCab({
          tokens: [{ name: "USDC" }],
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsEnablingCab(false);
    }
  }, [isEnabledOnCurrentChain, enableCab]);

  useEffect(() => {
    if (
      isConnected &&
      !isEnabledOnCurrentChain("USDC") &&
      !isPending &&
      !isEnablingCab
    ) {
      register();
    }
  }, [
    isConnected,
    register,
    isEnabledOnCurrentChain,
    isPending,
    isEnablingCab,
  ]);

  return { isEnablingCab };
}
