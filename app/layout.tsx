import type React from "react"
import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { ProjectsProvider } from "@/lib/projects-context"
import { AssetsProvider } from "@/lib/assets-context"
import { MasterDataProvider } from "@/lib/master-data-context"
import { ThemeProvider } from "@/lib/theme-context"
import { ThemeScript } from "@/components/theme-script"
import "./globals.css"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "Project Manager - Manage Your Work Efficiently",
  description: "A modern project management platform for teams to track projects, manage assets, and collaborate effectively.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="skyblue" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${manrope.variable} font-sans antialiased`}>
        <div className="noise-overlay" aria-hidden="true" />
        <ThemeProvider>
          <AuthProvider>
            <ProjectsProvider>
              <AssetsProvider>
                <MasterDataProvider>
                  {children}
                </MasterDataProvider>
              </AssetsProvider>
            </ProjectsProvider>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
