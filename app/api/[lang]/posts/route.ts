import { getAllPosts } from "@/lib/posts"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { lang: string } }) {
  try {
    const posts = await getAllPosts(params.lang)
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}
