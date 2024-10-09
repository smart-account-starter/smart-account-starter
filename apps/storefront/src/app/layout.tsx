import { Inter } from "next/font/google"
import "../styles/globals.css"
import { Header } from "@repo/ui/smart-account-starter/header"
import { Metadata } from "next";
import { ThemeProvider } from 'next-themes'
import { PrivyProvider } from "@privy-io/react-auth";
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";
import { PrivyProviderWrapper } from "./privy/PrivyProviderWrapper";
import { PrivyStatus } from "./privy/PrivyStatus";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Smart Account Starter",
  description: "connect with popular smart account solutions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrivyProviderWrapper>
          <ThemeProvider attribute="class">
            <div className="md:container mx-auto">
              <Header>
                <PrivyStatus />
              </Header>
              {children}
            </div>
          </ThemeProvider>
        </PrivyProviderWrapper>
      </body>
    </html>
  )
}
