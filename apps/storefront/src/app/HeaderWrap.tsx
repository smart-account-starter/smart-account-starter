'use client'

import { Header } from "@repo/ui/smart-account-starter/header"
import { useRouter } from "next/navigation"

export function HeaderWrap() {
  const router = useRouter()

  return (
    <Header onNavigateToCharts={() => router.push('/charts')} />
  )
}