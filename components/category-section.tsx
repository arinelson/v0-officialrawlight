import Link from "next/link"
import PostCard from "@/components/post-card"
import { ArrowRight } from "lucide-react"
import LazyLoad from "@/components/lazy-load"

interface CategorySectionProps {
  title: string
  posts: any[]
  lang: string
  dict: any
}

export default function CategorySection({ title, posts, lang, dict }: CategorySectionProps) {
  if (!posts || posts.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold capitalize flex items-center">
          <span className="inline-block w-2 h-6 bg-blue-500 mr-2"></span>
          {title}
        </h2>
        <Link
          href={`/${lang}/tags/${encodeURIComponent(title)}`}
          className="text-blue-500 flex items-center hover:underline"
        >
          {dict.home.viewAll} <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((post) => (
          <LazyLoad key={post.slug}>
            <PostCard post={post} lang={lang} dict={dict} />
          </LazyLoad>
        ))}
      </div>
    </section>
  )
}
