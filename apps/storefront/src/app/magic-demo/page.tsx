"use client"

import { StrictMode } from "react"
import dynamic from 'next/dynamic'
import "./index.css"
import "./polyfills.ts"
import "react-toastify/dist/ReactToastify.css"

const DynamicApp = dynamic(() => import('./App.tsx'), { ssr: false })
const DynamicProviders = dynamic(() => import('./Providers.tsx'), { ssr: false })

function MagicDemoPage() {
  return (
    <main className="min-h-screen bg-black">
      <h1>Chain-Abstracted Magic Account</h1>
      <StrictMode>
        <DynamicProviders>
          <DynamicApp />
        </DynamicProviders>
      </StrictMode>
    </main>
  )
}

export default MagicDemoPage
