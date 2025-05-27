"use client"

import { useState, useEffect } from "react"

const dictionaries = {
  en: () => import("../lib/dictionaries/en.json").then((module) => module.default),
  pt: () => import("../lib/dictionaries/pt.json").then((module) => module.default),
  es: () => import("../lib/dictionaries/es.json").then((module) => module.default),
  de: () => import("../lib/dictionaries/de.json").then((module) => module.default),
  fr: () => import("../lib/dictionaries/fr.json").then((module) => module.default),
  it: () => import("../lib/dictionaries/it.json").then((module) => module.default),
  fil: () => import("../lib/dictionaries/fil.json").then((module) => module.default),
}

export function useDictionary(locale: string) {
  const [dict, setDict] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        setLoading(true)
        const dictionary = dictionaries[locale as keyof typeof dictionaries] || dictionaries.en
        const result = await dictionary()
        setDict(result)
      } catch (error) {
        console.error("Failed to load dictionary:", error)
        // Fallback to English
        const fallback = await dictionaries.en()
        setDict(fallback)
      } finally {
        setLoading(false)
      }
    }

    loadDictionary()
  }, [locale])

  return { dict, loading }
}
