"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Search, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMobile } from "@/hooks/use-mobile"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  lang: string
  dict: any
}

export default function Header({ lang, dict }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const isMobile = useMobile()

  // Get the path without the language prefix
  const pathWithoutLang = pathname.replace(`/${lang}`, "")

  // Navigation items
  const navItems = [
    { href: "/", label: dict.nav.home },
    { href: "/posts", label: dict.nav.posts || "Posts" },
    { href: "/webstories", label: dict.nav.webstories || "WebStories" },
    { href: "/tags", label: dict.nav.tags },
    { href: "/about", label: dict.nav.about },
    { href: "/contact", label: dict.nav.contact },
  ]

  // Language options with proper labels and paths
  const languages = [
    { code: "en", label: "English", path: "en" },
    { code: "pt", label: "Português", path: "pt" },
    { code: "es", label: "Español", path: "es" },
    { code: "de", label: "Deutsch", path: "de" },
    { code: "fr", label: "Français", path: "fr" },
    { code: "it", label: "Italiano", path: "it" },
    { code: "fil", label: "Filipino", path: "fil" },
  ]

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen)
  }

  function closeMenu() {
    setIsMenuOpen(false)
  }

  // Handle language change
  const handleLanguageChange = (targetLang: string, targetPath: string) => {
    const newUrl = `/${targetPath}${pathWithoutLang}`
    router.push(newUrl)
  }

  return (
    <header className="w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={`/${lang}`} className="flex items-center space-x-2">
            <span className="text-xl font-bold">
              LUZ <span className="text-blue-500">CRUA</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={`/${lang}${item.href}`}
              className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                pathname === `/${lang}${item.href}` ? "text-blue-500" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Search */}
          <form action={`/${lang}/search`} className="hidden md:flex relative">
            <Input
              type="search"
              name="q"
              placeholder={dict.search?.placeholder || "Search..."}
              className="w-[200px] h-9 rounded-md"
            />
            <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-9 w-9">
              <Search className="h-4 w-4" />
              <span className="sr-only">{dict.search?.button || "Search"}</span>
            </Button>
          </form>

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Switch language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((language) => (
                <DropdownMenuItem
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code, language.path)}
                  className={language.code === lang ? "font-bold" : ""}
                >
                  {language.label}
                  {language.code === lang && " (Current)"}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            {/* Mobile Search */}
            <form action={`/${lang}/search`} className="flex relative">
              <Input
                type="search"
                name="q"
                placeholder={dict.search?.placeholder || "Search..."}
                className="w-full h-9 rounded-md"
              />
              <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-9 w-9">
                <Search className="h-4 w-4" />
                <span className="sr-only">{dict.search?.button || "Search"}</span>
              </Button>
            </form>

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${lang}${item.href}`}
                className={`block py-2 text-sm font-medium transition-colors hover:text-blue-500 ${
                  pathname === `/${lang}${item.href}` ? "text-blue-500" : "text-muted-foreground"
                }`}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Language Switcher */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-2">Languages:</p>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((language) => (
                  <Button
                    key={language.code}
                    variant={language.code === lang ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      handleLanguageChange(language.code, language.path)
                      closeMenu()
                    }}
                    className="justify-start"
                  >
                    {language.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
