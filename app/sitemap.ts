import { getAllPosts } from "@/lib/posts"
import { getAllTags } from "@/lib/tags"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://officialrawlight.com"
  const languages = ["en", "pt", "es", "de", "fr", "it", "fil"]

  // Base URLs for each language
  const languageUrls = languages.map((lang) => ({
    url: `${baseUrl}/${lang}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
  }))

  // Collect all posts for all languages
  const allPostsPromises = languages.map(async (lang) => {
    const posts = await getAllPosts(lang)
    return posts.map((post) => ({
      url: `${baseUrl}/${lang}/posts/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  })

  // Collect all WebStories for all languages
  const allWebStoriesPromises = languages.map(async (lang) => {
    const posts = await getAllPosts(lang)
    return posts.map((post) => ({
      url: `${baseUrl}/${lang}/webstories/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  })

  // Collect all tags for all languages
  const allTagsPromises = languages.map(async (lang) => {
    const tags = await getAllTags(lang)
    return tags.map((tag) => ({
      url: `${baseUrl}/${lang}/tags/${encodeURIComponent(tag)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }))
  })

  // Static pages for each language
  const staticPagesPromises = languages.map((lang) => {
    const pages = [
      { path: "/about", priority: 0.7 },
      { path: "/contact", priority: 0.7 },
      { path: "/privacy", priority: 0.3 },
      { path: "/terms", priority: 0.3 },
      { path: "/tags", priority: 0.6 },
      { path: "/search", priority: 0.6 },
      { path: "/posts", priority: 0.8 },
      { path: "/webstories", priority: 0.6 },
    ]

    return pages.map((page) => ({
      url: `${baseUrl}/${lang}${page.path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: page.priority,
    }))
  })

  // Resolve all promises
  const allPostsResults = await Promise.all(allPostsPromises)
  const allWebStoriesResults = await Promise.all(allWebStoriesPromises)
  const allTagsResults = await Promise.all(allTagsPromises)
  const staticPagesResults = await Promise.all(staticPagesPromises)

  // Flatten arrays
  const postUrls = allPostsResults.flat()
  const webStoryUrls = allWebStoriesResults.flat()
  const tagUrls = allTagsResults.flat()
  const staticPageUrls = staticPagesResults.flat()

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...languageUrls,
    ...postUrls,
    ...webStoryUrls,
    ...tagUrls,
    ...staticPageUrls,
  ]
}
