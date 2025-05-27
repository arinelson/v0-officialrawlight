import { getPostBySlug, getAllPosts } from "@/lib/posts"
import type { Metadata } from "next"
import WebStoryPageClient from "./WebStoryPageClient"

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string }
}): Promise<Metadata> {
  const post = await getPostBySlug(params.lang, params.slug)

  if (!post) {
    return {}
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://officialrawlight.com"

  return {
    title: `${post.title} - WebStory`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${baseUrl}/${params.lang}/webstories/${params.slug}`,
      images: [
        {
          url: `/placeholder.svg?height=640&width=360&text=${encodeURIComponent(post.title)}`,
          width: 360,
          height: 640,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
    // Web Stories specific metadata
    other: {
      "web-stories-replace-head-start": "",
      "web-stories-replace-head-end": "",
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
      console.error(`Error generating WebStory paths for language ${lang}:`, error)
    }
  }

  return paths
}

export default async function WebStoryPage({ params }: { params: { lang: string; slug: string } }) {
  return <WebStoryPageClient params={params} />
}
