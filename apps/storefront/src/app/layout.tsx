import { Inter } from "next/font/google"
import "../styles/globals.css"
import { Header } from "@repo/ui/smart-account-starter/header"
import { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { PrivyProviderWrapper } from "./privy/PrivyProviderWrapper"
import MagicProvider from "./magic/context/MagicProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Smart Account Starter",
  description: "connect with popular smart account solutions",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrivyProviderWrapper>
          <MagicProvider>
            <ThemeProvider attribute="class">
              <div className="md:container mx-auto">
                <Header />
                <div className="flex flex-col h-screen p-4">
                  {children}
                </div>
              </div>
            </ThemeProvider>
          </MagicProvider>
        </PrivyProviderWrapper>
      </body>
    </html>
  )
}
