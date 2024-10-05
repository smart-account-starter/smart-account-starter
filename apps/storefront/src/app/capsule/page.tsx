"use client"
// import { CapsuleDemo } from "@repo/shared-examples";
import dynamic from "next/dynamic"
import React, { useState, useEffect } from "react"
import Capsule, { Environment } from "@usecapsule/react-sdk"
import styles from "./page.module.css"

import "@usecapsule/react-sdk/styles.css"

const CapsuleModal = dynamic(
  () => import("@usecapsule/react-sdk").then((mod) => mod.CapsuleModal),
  { ssr: false }
)

// Initialize Capsule SDK with your API key and environment
const capsule = new Capsule(
  Environment.BETA,
  process.env.NEXT_PUBLIC_CAPSULE_API_KEY
)

export default function Home(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(true)
  }, [])

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Capsule</h1>
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-block"
            onClick={() => {
              setIsOpen(true)
            }}
          >
            Sign in with Capsule
          </button>

          <CapsuleModal
            capsule={capsule}
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false)
            }}
          />
        </div>
      </main>
    </div>
  )
}
