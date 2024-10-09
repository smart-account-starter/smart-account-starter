'use client'
import React, { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import DashboardStatus from "./DashboardStatus";

export default function Dashboard() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  if (!ready) {
    return <div>
      Loading...
      <p>Debug info: Ready: {ready.toString()}, Authenticated: {authenticated?.toString()}</p>
    </div>;
  }

  if (!authenticated) {
    return <div>Please log in to access the dashboard.</div>;
  }
  const {
    user,
  } = usePrivy();
  const smartWallet = user?.linkedAccounts.find(
    (account) => account.type === "smart_wallet"
  )
  console.log(smartWallet)

  async function getAccessTokenFn(){
    const {getAccessToken} = usePrivy();
    const accessToken = await getAccessToken();
    console.log(accessToken)
  }

  getAccessTokenFn()

  return (
    <main className="flex flex-col min-h-screen px-4 sm:px-20 py-6 sm:py-10 bg-privy-light-blue">
      {ready && authenticated ? (
        <DashboardStatus />
      ) : null}
    </main>
  );
}