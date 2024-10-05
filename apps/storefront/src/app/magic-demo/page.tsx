"use client"

import { StrictMode } from "react"
import Providers from "./Providers.tsx"
import "./index.css"
import "./polyfills.ts"
import "react-toastify/dist/ReactToastify.css"
import App from "./App.tsx"

function MagicDemoPage() {
  return (
    <main className="min-h-screen bg-black">
      <h1>Chain-Abstracted Magic Account</h1>
        <StrictMode>
          <Providers>
            <App />
          </Providers>
        </StrictMode>
    </main>
  )
}

export default MagicDemoPage
