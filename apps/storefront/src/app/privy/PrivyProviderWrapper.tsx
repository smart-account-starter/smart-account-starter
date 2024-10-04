'use client';

import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function PrivyProviderWrapper() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const { login } = useLogin({
    onComplete: () => router.push("/privy/dashboard"),
  });
  useEffect(() => {
    if (ready && authenticated) {
      router.push('/privy/dashboard');
    }
  }, [ready, authenticated, router]);

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button
        className="bg-violet-600 hover:bg-violet-700 py-3 px-6 text-white rounded-lg"
        onClick={login}
      >
        Log in
      </button>
    </div>
  );
}