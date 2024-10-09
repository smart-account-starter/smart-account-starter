'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';

export default function PrivyLogin() {
  const { login, ready, authenticated } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      login();
    }
  }, [ready, authenticated, login]);

  return null; // This component doesn't render anything
}