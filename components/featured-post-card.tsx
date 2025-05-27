import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import TagList from "@/components/tag-list"
import OptimizedImage from "@/components/optimized-image"

interface FeaturedPostCardProps {
  post: {
    slug: string
    title: string
    date: string
    excerpt: string
    tags: string[]
    readingTime: number
  }
  lang: string
  dict: any
}

export default function FeaturedPostCard({ post, lang, dict }: FeaturedPostCardProps) {
  return (
    <Card className="overflow-hidden h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
      <div className="md:flex h-full">
        <div className="relative w-full md:w-2/5 h-60 md:h-auto">
          <OptimizedImage
            src={`/placeholder.svg?height=600&width=800&text=${encodeURIComponent(post.title)}`}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <CardContent className="flex flex-col p-6 md:w-3/5">
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
              <span className="mx-2">•</span>
              <span>
                {post.readingTime} {dict.post.minutes}
              </span>
            </div>
            <Link href={`/${lang}/posts/${post.slug}`} className="inline-block">
              <h3 className="text-2xl font-bold leading-tight hover:text-blue-500 transition-colors">{post.title}</h3>
            </Link>
          </div>

          <p className="text-muted-foreground line-clamp-3 flex-grow">{post.excerpt}</p>

          <div className="mt-4 space-y-4">
            <TagList tags={post.tags} lang={lang} />
            <Link
              href={`/${lang}/posts/${post.slug}`}
              className="text-sm font-medium text-blue-500 hover:underline inline-block"
            >
              {dict.post.readMore} →
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
