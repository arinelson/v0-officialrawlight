"use client"

import { useState, useEffect } from "react"

export function useDictionary(locale: string) {
  const [dictionary, setDictionary] = useState<any>(null)

  useEffect(() => {
    async function loadDictionary() {
      try {
        const dict = await import(`@/lib/dictionaries/${locale}.json`)
        setDictionary(dict.default)
      } catch (error) {
        console.error("Failed to load dictionary:", error)
        // Fallback to English
        const dict = await import("@/lib/dictionaries/en.json")
        setDictionary(dict.default)
      }
    }

    loadDictionary()
  }, [locale])

  return dictionary
}
