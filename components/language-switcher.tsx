"use client"

import { Button } from "@/components/ui/button"
import { Globe, Loader2 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useState, useTransition } from "react"

interface LanguageSwitcherProps {
  currentLang: string
  dict?: any
}

export function LanguageSwitcher({ currentLang, dict }: LanguageSwitcherProps) {
  const [isChanging, setIsChanging] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "pt", name: "Português", flag: "🇧🇷" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
    { code: "fil", name: "Filipino", flag: "🇵🇭" },
  ]

  const currentLanguage = languages.find((l) => l.code === currentLang) || languages[0]

  const switchLanguage = (newLang: string) => {
    if (newLang === currentLang) return

    setIsChanging(true)

    // Set cookie for persistence
    document.cookie = `manual-lang=${newLang}; path=/; max-age=31536000`

    // Get path without current language
    const pathWithoutLang = pathname.replace(`/${currentLang}`, "") || "/"
    const newUrl = `/${newLang}${pathWithoutLang}`

    // Use transition for better UX
    startTransition(() => {
      router.push(newUrl)
    })

    // Reset loading state
    setTimeout(() => setIsChanging(false), 800)
  }

  return (
    <div className="relative group">
      <Button variant="outline" size="sm" className="gap-2" disabled={isChanging || isPending}>
        {isChanging || isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
        <span>{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
      </Button>

      {!isChanging && !isPending && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="p-2">
            <div className="text-xs text-muted-foreground mb-2 px-2">{dict?.language?.select || "Choose Language"}</div>
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => switchLanguage(language.code)}
                disabled={language.code === currentLang}
                className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-accent flex items-center space-x-2 transition-colors ${
                  language.code === currentLang ? "bg-accent font-medium" : ""
                }`}
              >
                <span>{language.flag}</span>
                <span>{language.name}</span>
                {language.code === currentLang && <span className="ml-auto text-xs text-blue-500">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
