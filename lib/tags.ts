import { getAllPosts } from "./posts"

export async function getAllTags(lang: string): Promise<string[]> {
  const posts = await getAllPosts(lang)

  // Extract all tags from all posts
  const allTags = posts.flatMap((post) => post.tags)

  // Remove duplicates and sort alphabetically
  return [...new Set(allTags)].sort()
}

export async function getTagsWithCount(lang: string): Promise<{ tag: string; count: number }[]> {
  const posts = await getAllPosts(lang)

  // Create a map to count occurrences of each tag
  const tagCounts = new Map<string, number>()

  // Count occurrences of each tag
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      const currentCount = tagCounts.get(tag) || 0
      tagCounts.set(tag, currentCount + 1)
    })
  })

  // Convert map to array of objects
  return Array.from(tagCounts.entries()).map(([tag, count]) => ({
    tag,
    count,
  }))
}
