import { Inter } from "next/font/google"
import "../styles/globals.css"
import { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { PrivyProviderWrapper } from "./privy/PrivyProviderWrapper"
import MagicProvider from "./magic/context/MagicProvider"
import dynamic from "next/dynamic"
import { AlchemyEmbeddedAccountProviders } from "./alchemy-embedded-account/app/providers"
import { headers } from "next/headers"
import { config } from "./alchemy-embedded-account/config"
import { cookieToInitialState } from "@account-kit/core"
import { ThirdwebProvider } from "thirdweb/react"
import { DynamicContextProviderWrapper } from "./dynamic/DynamicContextProviderWrapper"
import { HeaderWrap } from "./HeaderWrap"

const inter = Inter({ subsets: ["latin"] })
const DynamicProviders = dynamic(
  () => import("./magic/context/MagicProvider"),
  { ssr: false }
)
export const metadata: Metadata = {
  title: "Smart Account Starter",
  description: "connect with popular smart account solutions",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const initialState = cookieToInitialState(
    config,
    headers().get("cookie") ?? undefined
  )
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrivyProviderWrapper>
          <MagicProvider>
            <DynamicProviders>
              <AlchemyEmbeddedAccountProviders initialState={initialState}>
                <ThirdwebProvider>
                  <DynamicContextProviderWrapper>
                    <ThemeProvider attribute="class">
                      <div className="md:container mx-auto">
                        <HeaderWrap />
                        <div className="flex flex-col h-screen">
                          {children}
                        </div>
                      </div>
                    </ThemeProvider>
                  </DynamicContextProviderWrapper>
                </ThirdwebProvider>
              </AlchemyEmbeddedAccountProviders>
            </DynamicProviders>
          </MagicProvider>
        </PrivyProviderWrapper>
      </body>
    </html>
  )
}
