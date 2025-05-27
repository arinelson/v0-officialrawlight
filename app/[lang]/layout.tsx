import type React from "react"
import { Inter } from "next/font/google"
import { getDictionary } from "@/lib/dictionaries"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import CountryDetector from "@/components/country-detector"
import ReadingProgress from "@/components/reading-progress"
import "../globals.css"

const inter = Inter({ subsets: ["latin"] })

export async function generateStaticParams() {
  return [
    { lang: "en" },
    { lang: "pt" },
    { lang: "es" },
    { lang: "de" },
    { lang: "fr" },
    { lang: "it" },
    { lang: "fil" },
  ]
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const { lang } = await params

  let dict
  try {
    dict = await getDictionary(lang)
  } catch (error) {
    console.error("Error loading dictionary:", error)
    // Fallback dictionary
    dict = {
      site: { name: "LUZ CRUA", description: "Conexão profunda com Deus" },
      nav: { home: "Home", posts: "Posts", about: "About", contact: "Contact" },
      language: { select: "Select Language", autoDetect: "Auto-detect" },
    }
  }

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <CountryDetector />
        <div className="relative flex min-h-screen flex-col">
          <Header dict={dict} lang={lang} />
          <main className="flex-1">
            <ReadingProgress />
            {children}
          </main>
          <Footer dict={dict} lang={lang} />
        </div>
      </body>
    </html>
  )
}
