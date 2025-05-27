"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

// Country to language mapping
const countryToLanguage: Record<string, string> = {
  // Portuguese speaking countries
  BR: "pt", // Brazil
  PT: "pt", // Portugal
  AO: "pt", // Angola
  MZ: "pt", // Mozambique

  // Spanish speaking countries
  ES: "es", // Spain
  MX: "es", // Mexico
  AR: "es", // Argentina
  CO: "es", // Colombia
  PE: "es", // Peru
  VE: "es", // Venezuela
  CL: "es", // Chile
  EC: "es", // Ecuador
  BO: "es", // Bolivia
  PY: "es", // Paraguay
  UY: "es", // Uruguay
  CR: "es", // Costa Rica
  PA: "es", // Panama
  SV: "es", // El Salvador
  HN: "es", // Honduras
  NI: "es", // Nicaragua
  GT: "es", // Guatemala
  CU: "es", // Cuba
  DO: "es", // Dominican Republic

  // French speaking countries
  FR: "fr", // France
  CA: "fr", // Canada (Quebec)
  BE: "fr", // Belgium
  CH: "fr", // Switzerland
  SN: "fr", // Senegal
  CI: "fr", // Ivory Coast

  // German speaking countries
  DE: "de", // Germany
  AT: "de", // Austria

  // Italian speaking countries
  IT: "it", // Italy
  SM: "it", // San Marino
  VA: "it", // Vatican

  // Filipino speaking countries
  PH: "fil", // Philippines

  // English speaking countries (default)
  US: "en", // United States
  GB: "en", // United Kingdom
  AU: "en", // Australia
  NZ: "en", // New Zealand
  IE: "en", // Ireland
  ZA: "en", // South Africa
  IN: "en", // India
  SG: "en", // Singapore
  MY: "en", // Malaysia
}

const supportedLanguages = ["en", "pt", "es", "de", "fr", "it", "fil"]

export default function CountryDetector() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user has manually selected a language
    const hasManualSelection = document.cookie.includes("preferred-language=")

    if (hasManualSelection) {
      return // Don't auto-detect if user has made a manual selection
    }

    // Check if we already detected the country
    const hasAutoDetected = document.cookie.includes("auto-detected-language=")

    if (hasAutoDetected) {
      return // Don't detect again if we already did
    }

    // Get current language from pathname
    const currentLang = pathname.split("/")[1]

    if (!supportedLanguages.includes(currentLang)) {
      return // Invalid language in URL
    }

    // Try multiple geolocation services
    const detectCountry = async () => {
      try {
        // Try ipapi.co first
        const response = await fetch("https://ipapi.co/json/")
        const data = await response.json()

        if (data.country_code && countryToLanguage[data.country_code]) {
          const detectedLang = countryToLanguage[data.country_code]

          // Only redirect if detected language is different from current
          if (detectedLang !== currentLang) {
            // Set cookie to remember we auto-detected
            document.cookie = `auto-detected-language=${detectedLang}; path=/; max-age=${60 * 60 * 24 * 30}` // 30 days

            // Redirect to detected language
            const newPath = pathname.replace(`/${currentLang}`, `/${detectedLang}`)
            router.push(newPath)
          }
        }
      } catch (error) {
        // Fallback to other services
        try {
          const response = await fetch("https://api.country.is/")
          const data = await response.json()

          if (data.country && countryToLanguage[data.country]) {
            const detectedLang = countryToLanguage[data.country]

            if (detectedLang !== currentLang) {
              document.cookie = `auto-detected-language=${detectedLang}; path=/; max-age=${60 * 60 * 24 * 30}`
              const newPath = pathname.replace(`/${currentLang}`, `/${detectedLang}`)
              router.push(newPath)
            }
          }
        } catch (fallbackError) {
          console.log("Country detection failed, using default language")
        }
      }
    }

    // Delay detection to avoid blocking initial render
    const timer = setTimeout(detectCountry, 1000)

    return () => clearTimeout(timer)
  }, [pathname, router])

  return null // This component doesn't render anything
}
