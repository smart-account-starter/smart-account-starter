'use client';

import { usePrivy } from "@privy-io/react-auth";

export function PrivyStatus() {
  const { ready, authenticated } = usePrivy();
  return <div>ready: {ready.toString()}, authenticated: {authenticated.toString()}</div>;
}
