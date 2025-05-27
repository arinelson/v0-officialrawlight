"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Globe } from "lucide-react"
import { useState } from "react"

interface HeaderProps {
  dict: any
  lang: string
}

export function Header({ dict, lang }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "pt", name: "Português", flag: "🇧🇷" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
    { code: "fil", name: "Filipino", flag: "🇵🇭" },
  ]

  const currentLang = languages.find((l) => l.code === lang) || languages[0]

  const switchLanguage = (newLang: string) => {
    // Set manual selection cookie
    document.cookie = `manual-lang=${newLang}; path=/; max-age=31536000`

    // Get current path without language
    const pathWithoutLang = pathname.replace(`/${lang}`, "") || "/"

    // Navigate to new language
    window.location.href = `/${newLang}${pathWithoutLang}`
  }

  const resetToAutoDetect = () => {
    // Remove manual selection cookie
    document.cookie = "manual-lang=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    // Redirect to root for auto-detection
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href={`/${lang}`} className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">{dict?.site?.name || "LUZ CRUA"}</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href={`/${lang}`} className="transition-colors hover:text-foreground/80 text-foreground/60">
              {dict?.nav?.home || "Home"}
            </Link>
            <Link href={`/${lang}/posts`} className="transition-colors hover:text-foreground/80 text-foreground/60">
              {dict?.nav?.posts || "Posts"}
            </Link>
            <Link href={`/${lang}/about`} className="transition-colors hover:text-foreground/80 text-foreground/60">
              {dict?.nav?.about || "About"}
            </Link>
            <Link href={`/${lang}/contact`} className="transition-colors hover:text-foreground/80 text-foreground/60">
              {dict?.nav?.contact || "Contact"}
            </Link>
          </nav>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle Menu</span>
        </Button>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-14 left-0 right-0 bg-background border-b md:hidden">
            <nav className="flex flex-col space-y-4 p-4">
              <Link
                href={`/${lang}`}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                onClick={() => setIsMenuOpen(false)}
              >
                {dict?.nav?.home || "Home"}
              </Link>
              <Link
                href={`/${lang}/posts`}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                onClick={() => setIsMenuOpen(false)}
              >
                {dict?.nav?.posts || "Posts"}
              </Link>
              <Link
                href={`/${lang}/about`}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                onClick={() => setIsMenuOpen(false)}
              >
                {dict?.nav?.about || "About"}
              </Link>
              <Link
                href={`/${lang}/contact`}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                onClick={() => setIsMenuOpen(false)}
              >
                {dict?.nav?.contact || "Contact"}
              </Link>
            </nav>
          </div>
        )}

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Language Selector */}
            <div className="relative group">
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                <Globe className="h-4 w-4 mr-1" />
                <span className="mr-1">{currentLang.flag}</span>
                <span className="hidden sm:inline">{currentLang.name}</span>
                <span className="sm:hidden">{currentLang.code.toUpperCase()}</span>
              </Button>

              <div className="absolute right-0 top-full mt-1 w-48 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <div className="text-xs text-muted-foreground mb-2 px-2">
                    {dict?.language?.select || "Select Language"}
                  </div>
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => switchLanguage(language.code)}
                      className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-accent flex items-center space-x-2 ${
                        language.code === lang ? "bg-accent" : ""
                      }`}
                    >
                      <span>{language.flag}</span>
                      <span>{language.name}</span>
                      {language.code === lang && <span className="ml-auto text-xs text-muted-foreground">✓</span>}
                    </button>
                  ))}
                  <hr className="my-2" />
                  <button
                    onClick={resetToAutoDetect}
                    className="w-full text-left px-2 py-1 text-xs text-muted-foreground hover:bg-accent rounded"
                  >
                    🌍 {dict?.language?.autoDetect || "Auto-detect"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
