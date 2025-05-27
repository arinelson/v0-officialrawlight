import "server-only"

interface Dictionary {
  [key: string]: any
}

// Default English dictionary as fallback
const defaultDictionary = {
  site: {
    name: "LUZ CRUA",
    description: "A modern and responsive static blog focused on content organization and user experience",
  },
  nav: {
    home: "Home",
    about: "About",
    tags: "Tags",
    search: "Search",
    contact: "Contact",
    posts: "Posts",
  },
  footer: {
    rights: "All rights reserved.",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
  },
}

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en.json").then((module) => module.default).catch(() => defaultDictionary),
  pt: () => import("./dictionaries/pt.json").then((module) => module.default).catch(() => defaultDictionary),
  es: () => import("./dictionaries/es.json").then((module) => module.default).catch(() => defaultDictionary),
  de: () => import("./dictionaries/de.json").then((module) => module.default).catch(() => defaultDictionary),
  fr: () => import("./dictionaries/fr.json").then((module) => module.default).catch(() => defaultDictionary),
  it: () => import("./dictionaries/it.json").then((module) => module.default).catch(() => defaultDictionary),
  fil: () => import("./dictionaries/fil.json").then((module) => module.default).catch(() => defaultDictionary),
}

export async function getDictionary(locale: string): Promise<Dictionary> {
  try {
    // Default to 'en' if the locale is not supported
    const lang = dictionaries[locale] ? locale : "en"
    return await dictionaries[lang]()
  } catch (error) {
    console.error("Failed to load dictionary:", error)
    return defaultDictionary
  }
}
