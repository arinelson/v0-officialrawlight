import "server-only"

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  pt: () => import("./dictionaries/pt.json").then((module) => module.default),
  es: () => import("./dictionaries/es.json").then((module) => module.default),
  de: () => import("./dictionaries/de.json").then((module) => module.default),
  fr: () => import("./dictionaries/fr.json").then((module) => module.default),
  it: () => import("./dictionaries/it.json").then((module) => module.default),
  fil: () => import("./dictionaries/fil.json").then((module) => module.default),
}

export const getDictionary = async (locale: string) => {
  try {
    const dict = dictionaries[locale as keyof typeof dictionaries]
    if (dict) {
      return await dict()
    }
    // Fallback to English
    return await dictionaries.en()
  } catch (error) {
    console.error(`Error loading dictionary for locale ${locale}:`, error)
    // Return English as fallback
    return await dictionaries.en()
  }
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>
