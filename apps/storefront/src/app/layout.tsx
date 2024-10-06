import { Inter } from "next/font/google"
import "../styles/globals.css"
import { Header } from "@repo/ui/smart-account-starter/header"
import { Metadata } from "next";
import { ThemeProvider } from 'next-themes'

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
        <ThemeProvider attribute="class">
          <div className="md:container mx-auto">
            <Header />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
