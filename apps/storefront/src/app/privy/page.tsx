'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PrivyLogin from './PrivyLogin';

export default function PrivyPage() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push('/privy/dashboard');
    }
  }, [ready, authenticated, router]);

  if (!ready) {
    return <div>Loading...</div>;
  }

  if (authenticated) {
    return <div>Redirecting to dashboard...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privy Authentication</h1>
      <PrivyLogin />
      <p>Please log in to continue.</p>
    </div>
  );
}
