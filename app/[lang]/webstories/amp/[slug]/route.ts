import { getAllPosts, getPostBySlug } from "@/lib/posts"
import { generateWebStoryFromPost, generateAMPWebStory } from "@/lib/web-stories"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { lang: string; slug: string } }) {
  try {
    const post = await getPostBySlug(params.lang, params.slug)

    if (!post) {
      return new NextResponse("Web Story not found", { status: 404 })
    }

    const slides = generateWebStoryFromPost(post)
    const ampHtml = generateAMPWebStory(post, slides, params.lang)

    return new NextResponse(ampHtml, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("Error generating AMP Web Story:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
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
      console.error(`Error generating AMP WebStory paths for language ${lang}:`, error)
    }
  }

  return paths
}
