import { Inter } from "next/font/google"
import "../styles/globals.css"
import { Header } from "@repo/ui/smart-account-starter/header"
import { Metadata } from "next";
// import { Header } from "@repo/ui/src/smart-account-starter/header"

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
        <div className="container mx-auto">
          <Header />
          {children}
        </div>
      </body>
    </html>
  )
}
