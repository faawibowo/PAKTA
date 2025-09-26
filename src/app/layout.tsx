import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { UserRoleProvider } from "@/context/user-role-context"

export const metadata: Metadata = {
  title: "Smart Contract Vault",
  description: "AI-powered contract management and validation platform",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body className="font-sans bg-background text-foreground">
        <Suspense fallback={null}>
          <UserRoleProvider>{children}</UserRoleProvider>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
