import { getDictionary } from "@/lib/dictionaries"
import { getAllPosts } from "@/lib/posts"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import type { Metadata } from "next"
import OptimizedImage from "@/components/optimized-image"

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang)

  return {
    title: `${dict.nav.webstories} - ${dict.site.name}`,
    description: `Explore our ${dict.nav.webstories} in ${params.lang}`,
  }
}

export default async function WebStoriesPage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang)
  const allPosts = await getAllPosts(params.lang)

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{dict.nav.webstories}</h1>
        <p className="text-muted-foreground">Discover our stories in an immersive, mobile-first format</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {allPosts.map((post) => (
          <Link key={post.slug} href={`/${params.lang}/webstories/${post.slug}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow aspect-[9/16] group">
              <div className="relative h-full">
                <OptimizedImage
                  src={`/placeholder.svg?height=640&width=360&text=${encodeURIComponent(post.title)}`}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <h3 className="font-bold text-sm leading-tight line-clamp-2 mb-1">{post.title}</h3>
                  <p className="text-xs opacity-75">{formatDate(post.date, params.lang)}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {allPosts.length === 0 && (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">No WebStories available yet</h2>
          <p className="text-muted-foreground">WebStories will be created automatically when posts are available.</p>
        </div>
      )}
    </div>
  )
}
