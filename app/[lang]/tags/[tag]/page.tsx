import { getDictionary } from "@/lib/dictionaries"
import { getPostsByTag } from "@/lib/posts"
import { getAllTags } from "@/lib/tags"
import PostCard from "@/components/post-card"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: { lang: string; tag: string }
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang)
  const decodedTag = decodeURIComponent(params.tag)

  return {
    title: `${dict.tags.title}: ${decodedTag}`,
    description: `${dict.tags.description} ${decodedTag}`,
  }
}

export async function generateStaticParams() {
  // Generate for all languages and all tags
  const languages = ["en", "pt", "es"]
  const paths = []

  for (const lang of languages) {
    const tags = await getAllTags(lang)
    const langPaths = tags.map((tag) => ({
      lang,
      tag: encodeURIComponent(tag),
    }))
    paths.push(...langPaths)
  }

  return paths
}

export default async function TagPage({ params }: { params: { lang: string; tag: string } }) {
  const dict = await getDictionary(params.lang)
  const decodedTag = decodeURIComponent(params.tag)
  const posts = await getPostsByTag(params.lang, decodedTag)

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">
          {dict.tags.title}: {decodedTag}
        </h1>
        <p className="text-muted-foreground">
          {posts.length} {posts.length === 1 ? dict.tags.post : dict.tags.posts}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} lang={params.lang} dict={dict} />
        ))}
      </div>
    </div>
  )
}
