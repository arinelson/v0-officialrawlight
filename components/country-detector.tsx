"use client"

import { useEffect } from "react"

export default function CountryDetector() {
  useEffect(() => {
    // Check if user has manually selected a language
    const hasManualSelection = document.cookie.includes("manual-lang=")

    if (hasManualSelection) {
      return // Don't auto-detect if user has made a manual selection
    }

    // Check if we're on the root path
    if (window.location.pathname === "/") {
      detectCountryAndRedirect()
    }
  }, [])

  const detectCountryAndRedirect = async () => {
    try {
      // Try multiple geolocation services
      const services = [
        "https://ipapi.co/json/",
        "https://ipinfo.io/json",
        "https://api.ipgeolocation.io/ipgeo?apiKey=free",
      ]

      let detectedLang = "en" // Default fallback

      for (const service of services) {
        try {
          const response = await fetch(service)
          const data = await response.json()

          const country = data.country_code || data.country || data.countryCode

          if (country) {
            detectedLang = getLanguageFromCountry(country)
            break
          }
        } catch (error) {
          console.warn(`Failed to fetch from ${service}:`, error)
          continue
        }
      }

      // Redirect to detected language
      if (detectedLang && detectedLang !== "en") {
        window.location.href = `/${detectedLang}`
      } else {
        window.location.href = "/en"
      }
    } catch (error) {
      console.error("Country detection failed:", error)
      // Fallback to English
      window.location.href = "/en"
    }
  }

  const getLanguageFromCountry = (country: string): string => {
    const countryToLang: Record<string, string> = {
      // Portuguese
      BR: "pt", // Brazil
      PT: "pt", // Portugal
      AO: "pt", // Angola
      MZ: "pt", // Mozambique

      // Spanish
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

      // German
      DE: "de", // Germany
      AT: "de", // Austria
      CH: "de", // Switzerland (partial)

      // French
      FR: "fr", // France
      BE: "fr", // Belgium (partial)
      CA: "fr", // Canada (partial)

      // Italian
      IT: "it", // Italy

      // Filipino
      PH: "fil", // Philippines
    }

    return countryToLang[country.toUpperCase()] || "en"
  }

  return null // This component doesn't render anything
}
