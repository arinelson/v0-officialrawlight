import { getAllPosts } from "@/lib/posts"
import { generateRssFeed } from "@/lib/utils"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get posts for the default language (English)
    const posts = await getAllPosts("en")

    // Generate RSS feed
    const feed = generateRssFeed(posts, "en")

    // Return the RSS feed
    return new NextResponse(feed, {
      headers: {
        "Content-Type": "application/xml",
      },
    })
  } catch (error) {
    console.error("Error generating RSS feed:", error)
    return NextResponse.json({ error: "Failed to generate RSS feed" }, { status: 500 })
  }
}
