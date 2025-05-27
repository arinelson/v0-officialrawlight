import type React from "react"
import { Inter } from "next/font/google"
import "../globals.css"
import { getDictionary } from "@/lib/dictionaries"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import ReadingProgress from "@/components/reading-progress"
import CountryDetector from "@/components/country-detector"

const inter = Inter({ subsets: ["latin"], display: "swap" })

// Default fallback dictionary
const defaultDict = {
  site: {
    name: "LUZ CRUA",
    description: "A multilingual blog",
    keywords: "blog, multilingual, content",
  },
  nav: {
    home: "Home",
    about: "About",
    tags: "Tags",
    search: "Search",
    contact: "Contact",
    posts: "Posts",
    webstories: "WebStories",
  },
  footer: {
    rights: "All rights reserved.",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
  },
  search: {
    placeholder: "Search...",
    button: "Search",
  },
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  try {
    const dict = await getDictionary(params.lang)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://officialrawlight.com"

    // Generate alternate URLs for all supported languages
    const alternateLanguages: Record<string, string> = {}
    const languages = ["en", "pt", "es", "de", "fr", "it", "fil"]

    languages.forEach((code) => {
      alternateLanguages[code] = `${baseUrl}/${code}`
    })

    return {
      title: dict?.site?.name || defaultDict.site.name,
      description: dict?.site?.description || defaultDict.site.description,
      keywords: dict?.site?.keywords || defaultDict.site.keywords,
      authors: [{ name: "LUZ CRUA" }],
      openGraph: {
        title: dict?.site?.name || defaultDict.site.name,
        description: dict?.site?.description || defaultDict.site.description,
        url: `${baseUrl}/${params.lang}`,
        siteName: dict?.site?.name || defaultDict.site.name,
        locale: params.lang,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: dict?.site?.name || defaultDict.site.name,
        description: dict?.site?.description || defaultDict.site.description,
      },
      alternates: {
        canonical: `${baseUrl}/${params.lang}`,
        languages: alternateLanguages,
        types: {
          "application/rss+xml": `${baseUrl}/rss/${params.lang}.xml`,
        },
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: defaultDict.site.name,
      description: defaultDict.site.description,
    }
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  let dict = defaultDict

  try {
    const loadedDict = await getDictionary(params.lang)
    dict = { ...defaultDict, ...loadedDict }
  } catch (error) {
    console.error("Error loading dictionary in layout:", error)
    // Use default dict as fallback
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://officialrawlight.com"
  const supportedLanguages = ["en", "pt", "es", "de", "fr", "it", "fil"]

  return (
    <html lang={params.lang} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* Hreflang tags for international SEO */}
        {supportedLanguages.map((lang) => (
          <link key={lang} rel="alternate" href={`${baseUrl}/${lang}`} hrefLang={lang} />
        ))}
        <link rel="alternate" href={`${baseUrl}/en`} hrefLang="x-default" />

        {/* RSS feed link */}
        <link
          rel="alternate"
          type="application/rss+xml"
          href={`/rss/${params.lang}.xml`}
          title={`${dict.site.name} - RSS Feed (${params.lang.toUpperCase()})`}
        />

        {/* Preconnect to AdSense */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />

        {/* Preload fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Structured data for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: dict.site.name,
              url: `${baseUrl}/${params.lang}`,
              potentialAction: {
                "@type": "SearchAction",
                target: `${baseUrl}/${params.lang}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CountryDetector />
          <div className="flex min-h-screen flex-col">
            <Header lang={params.lang} dict={dict} />
            <main className="flex-1 container mx-auto px-4 py-8 relative">
              <ReadingProgress />
              {children}
            </main>
            <Footer lang={params.lang} dict={dict} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
