"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Globe, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface LanguagePostSwitcherProps {
  currentLang: string
  translations: Record<string, string>
  slug: string
}

export default function LanguagePostSwitcher({ currentLang, translations, slug }: LanguagePostSwitcherProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  // Language names mapping with native names
  const languageNames = {
    en: "English",
    pt: "Português",
    es: "Español",
    de: "Deutsch",
    fr: "Français",
    it: "Italiano",
    fil: "Filipino",
  }

  // Language codes for URL paths
  const languagePaths = {
    en: "en",
    pt: "pt",
    es: "es",
    de: "de",
    fr: "fr",
    it: "it",
    fil: "fil",
  }

  // Handle language change with proper post translation
  const handleLanguageChange = (lang: string, translatedSlug: string) => {
    const targetPath = languagePaths[lang] || lang
    const newUrl = `/${targetPath}/posts/${translatedSlug}`

    // Use router.push for client-side navigation
    router.push(newUrl)
    setIsOpen(false)
  }

  // Build complete translations list including current language
  const allTranslations = { ...translations }

  // Always include current language with current slug
  allTranslations[currentLang] = slug

  // Sort languages for consistent display
  const sortedTranslations = Object.entries(allTranslations).sort(([a], [b]) => {
    const order = ["en", "pt", "es", "de", "fr", "it", "fil"]
    return order.indexOf(a) - order.indexOf(b)
  })

  // Count available translations
  const translationCount = sortedTranslations.length

  return (
    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Languages className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Available Languages:</span>
        </div>
        <Badge variant="secondary" className="text-xs">
          {translationCount} {translationCount === 1 ? "language" : "languages"}
        </Badge>
      </div>

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Globe className="h-4 w-4" />
            {languageNames[currentLang as keyof typeof languageNames] || currentLang}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {sortedTranslations.map(([lang, translatedSlug]) => (
            <DropdownMenuItem
              key={lang}
              onClick={() => handleLanguageChange(lang, translatedSlug)}
              className={`flex items-center justify-between ${lang === currentLang ? "font-bold bg-muted" : ""}`}
            >
              <span>{languageNames[lang as keyof typeof languageNames] || lang}</span>
              {lang === currentLang && (
                <Badge variant="default" className="text-xs ml-2">
                  Current
                </Badge>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
