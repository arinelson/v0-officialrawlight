import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string, locale = "en"): string {
  const date = new Date(dateString)

  // Map locale codes to Intl locale codes
  const localeMap: Record<string, string> = {
    en: "en-US",
    pt: "pt-BR",
    es: "es-ES",
  }

  const formattedDate = new Intl.DateTimeFormat(localeMap[locale] || "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)

  return formattedDate
}

export function generateRssFeed(posts: any[], lang: string) {
  const site_url = "https://officialrawlight.com"

  const feedItems = posts
    .map((post) => {
      return `
      <item>
        <title>${post.title}</title>
        <link>${site_url}/${lang}/posts/${post.slug}</link>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <description>${post.excerpt}</description>
      </item>
    `
    })
    .join("")

  const feed = `
    <?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>LUZ CRUA - ORE COMO JESUS</title>
        <link>${site_url}</link>
        <description>Conexão profunda com Deus através dos ensinamentos de Jesus.</description>
        ${feedItems}
      </channel>
    </rss>
  `

  return feed
}
