"use client"

import React, { Suspense } from "react"

export default function ChartsPage() {
  const AccountDeployer = React.lazy(
    () => import("../components/AccountDeployer")
  )
  return (
    <main className="min-h-screen bg-black">
      <h1>Charts</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <AccountDeployer />
      </Suspense>
    </main>
  )
}
