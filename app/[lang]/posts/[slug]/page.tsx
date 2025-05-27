import { getDictionary } from "@/lib/dictionaries"
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/posts"
import { formatDate } from "@/lib/utils"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Markdown from "react-markdown"
import ShareButtons from "@/components/share-buttons"
import PostCard from "@/components/post-card"
import TagList from "@/components/tag-list"
import Image from "next/image"

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string }
}): Promise<Metadata> {
  const post = await getPostBySlug(params.lang, params.slug)
  const dict = await getDictionary(params.lang)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://officialrawlight.com"

  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags.join(", "),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: ["LUZ CRUA"],
      tags: post.tags,
      url: `${baseUrl}/${params.lang}/posts/${params.slug}`,
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}&lang=${params.lang}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: params.lang,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [`${baseUrl}/api/og?title=${encodeURIComponent(post.title)}&lang=${params.lang}`],
    },
    alternates: {
      canonical: `${baseUrl}/${params.lang}/posts/${params.slug}`,
      types: {
        "application/rss+xml": `${baseUrl}/rss/${params.lang}.xml`,
      },
    },
  }
}

export async function generateStaticParams() {
  const languages = ["en", "pt", "es", "de", "fr", "it", "fil"]
  const paths = []

  for (const lang of languages) {
    try {
      const posts = await getAllPosts(lang)
      const langPaths = posts.map((post) => ({
        lang: lang,
        slug: post.slug,
      }))
      paths.push(...langPaths)
    } catch (error) {
      console.error(`Error generating paths for language ${lang}:`, error)
    }
  }

  return paths
}

export default async function PostPage({ params }: { params: { lang: string; slug: string } }) {
  const dict = await getDictionary(params.lang)
  const post = await getPostBySlug(params.lang, params.slug)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://officialrawlight.com"

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(params.lang, post.slug, post.tags, 2)
  const postUrl = `${baseUrl}/${params.lang}/posts/${post.slug}`

  return (
    <article className="max-w-3xl mx-auto">
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <time dateTime={post.date}>{formatDate(post.date, params.lang)}</time>
          <div className="text-sm">
            {dict.post.readingTime}: {post.readingTime} {dict.post.minutes}
          </div>
        </div>
        <TagList tags={post.tags} lang={params.lang} />

        {/* Featured image with proper alt text */}
      </div>

      {/* Featured image with proper alt text */}
      <div className="relative w-full h-[300px] mb-8 rounded-lg overflow-hidden">
        <Image
          src={`/aculpadeabraao.png?height=600&width=1200&text=${encodeURIComponent(post.title)}`}
          alt={post.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 1200px"
        />
      </div>

      <div className="prose dark:prose-invert max-w-none mb-12">
        <Markdown>{post.content}</Markdown>
      </div>

      <ShareButtons url={postUrl} title={post.title} dict={dict} lang={params.lang} />

      {relatedPosts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">{dict.post.relatedPosts}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map((relatedPost) => (
              <PostCard key={relatedPost.slug} post={relatedPost} lang={params.lang} dict={dict} />
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
