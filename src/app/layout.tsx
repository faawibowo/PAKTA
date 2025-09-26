import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { UserRoleProvider } from "@/context/user-role-context"

export const metadata: Metadata = {
  title: "PAKTA",
  description: "AI-powered contract management and validation platform",
  generator: "v0.app",
  icons: '/pakta.ico'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <head>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body className="font-sans bg-background text-foreground">
        <Suspense fallback={null}>
          <UserRoleProvider>{children}</UserRoleProvider>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
