import { getAllPosts } from "@/lib/posts"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { lang: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json([])
    }

    const posts = await getAllPosts(params.lang)
    const lowerCaseQuery = query.toLowerCase()

    const results = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerCaseQuery) ||
        post.excerpt.toLowerCase().includes(lowerCaseQuery) ||
        post.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery)),
    )

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: "Failed to search posts" }, { status: 500 })
  }
}
