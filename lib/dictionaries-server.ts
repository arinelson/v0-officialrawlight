"use server"

// Server-only version for server components
const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  pt: () => import("./dictionaries/pt.json").then((module) => module.default),
  es: () => import("./dictionaries/es.json").then((module) => module.default),
  de: () => import("./dictionaries/de.json").then((module) => module.default),
  fr: () => import("./dictionaries/fr.json").then((module) => module.default),
  it: () => import("./dictionaries/it.json").then((module) => module.default),
  fil: () => import("./dictionaries/fil.json").then((module) => module.default),
}

export const getDictionaryServer = async (locale: string) => {
  try {
    if (!dictionaries[locale as keyof typeof dictionaries]) {
      return await dictionaries.en()
    }
    return await dictionaries[locale as keyof typeof dictionaries]()
  } catch (error) {
    console.error("Failed to load dictionary:", error)
    return await dictionaries.en()
  }
}
