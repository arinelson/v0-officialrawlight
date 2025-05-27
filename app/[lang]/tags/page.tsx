import { getDictionary } from "@/lib/dictionaries"
import { getTagsWithCount } from "@/lib/tags"
import Link from "next/link"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang)

  return {
    title: dict.tags.allTags,
    description: dict.tags.allTagsDescription,
  }
}

export default async function TagsPage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang)
  const tagsWithCount = await getTagsWithCount(params.lang)

  // Sort tags by count (descending)
  const sortedTags = [...tagsWithCount].sort((a, b) => b.count - a.count)

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{dict.tags.allTags}</h1>
        <p className="text-muted-foreground">{dict.tags.allTagsDescription}</p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {sortedTags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/${params.lang}/tags/${encodeURIComponent(tag)}`}
            className="px-4 py-2 bg-muted rounded-full text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {tag} ({count})
          </Link>
        ))}
      </div>
    </div>
  )
}
