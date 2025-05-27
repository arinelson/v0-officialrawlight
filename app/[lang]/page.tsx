import { getDictionary } from "@/lib/dictionaries"
import { getAllPosts } from "@/lib/posts"
import { getTagsWithCount } from "@/lib/tags"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { Metadata } from "next"
import PostCard from "@/components/post-card"
import CategorySection from "@/components/category-section"
import NewsletterSignup from "@/components/newsletter-signup"
import LazyLoad from "@/components/lazy-load"
import AdSense from "@/components/adsense"
import OptimizedImage from "@/components/optimized-image"
import { formatDate } from "@/lib/utils"

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  try {
    const dict = await getDictionary(params.lang)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://officialrawlight.com"

    return {
      title: dict.site.name,
      description: dict.site.description,
      keywords: dict.site.keywords,
      openGraph: {
        title: dict.site.name,
        description: dict.site.description,
        url: `${baseUrl}/${params.lang}`,
        siteName: dict.site.name,
        locale: params.lang,
        type: "website",
        images: [
          {
            url: `${baseUrl}/api/og?title=${encodeURIComponent(dict.site.name)}&lang=${params.lang}`,
            width: 1200,
            height: 630,
            alt: dict.site.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: dict.site.name,
        description: dict.site.description,
        images: [`${baseUrl}/api/og?title=${encodeURIComponent(dict.site.name)}&lang=${params.lang}`],
      },
    }
  } catch (error) {
    return {
      title: "LUZ CRUA",
      description: "A multilingual blog",
    }
  }
}

export default async function Home({ params }: { params: { lang: string } }) {
  let dict, allPosts, tagsWithCount

  try {
    console.log(`Loading home page for language: ${params.lang}`)
    dict = await getDictionary(params.lang)
    allPosts = await getAllPosts(params.lang)
    tagsWithCount = await getTagsWithCount(params.lang)

    console.log(`Loaded ${allPosts.length} posts for ${params.lang}`)
    console.log(
      `Posts:`,
      allPosts.map((p) => ({ slug: p.slug, title: p.title })),
    )
  } catch (error) {
    console.error("Error loading home page data:", error)
    dict = {
      site: {
        name: "LUZ CRUA",
        description: "A multilingual blog",
      },
      home: {
        subtitle: "A modern and responsive static blog",
        exploreButton: "Explore",
        aboutButton: "About",
        featuredPost: "Featured Post",
        latestPosts: "Latest Posts",
        viewAll: "View All",
      },
      post: {
        readMore: "Read More",
        minutes: "min read",
      },
    }
    allPosts = []
    tagsWithCount = []
  }

  // Get top 3 tags
  const topTags = [...(tagsWithCount || [])]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((item) => item.tag)

  // Featured posts (latest 2)
  const featuredPosts = allPosts.slice(0, 2)

  // Recent posts (next 6 after featured)
  const recentPosts = allPosts.slice(2, 8)

  // Posts by category (top 3 tags)
  const postsByCategory = {}
  for (const tag of topTags) {
    postsByCategory[tag] = allPosts.filter((post) => post.tags.includes(tag)).slice(0, 4)
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-10 border-b pb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          LUZ<span className="text-blue-500">CRUA</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{dict.home.subtitle}</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600">
            <Link href={`/${params.lang}/tags`}>
              {dict.home.exploreButton} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href={`/${params.lang}/about`}>{dict.home.aboutButton}</Link>
          </Button>
        </div>
      </section>

      {/* Post em Muito Destaque (Highly Featured Post) */}
      {featuredPosts.length > 0 && (
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12">
            {/* Content Side */}
            <div className="flex flex-col justify-center space-y-6">
              <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium w-fit">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                {dict.home.featuredPost}
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">{featuredPosts[0].title}</h2>

              <p className="text-xl text-white/90 leading-relaxed">{featuredPosts[0].excerpt}</p>

              <div className="flex items-center gap-4 text-white/80">
                <time dateTime={featuredPosts[0].date}>{formatDate(featuredPosts[0].date, params.lang)}</time>
                <span>•</span>
                <span>
                  {featuredPosts[0].readingTime} {dict.post.minutes}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {featuredPosts[0].tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>

              <Link
                href={`/${params.lang}/posts/${featuredPosts[0].slug}`}
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors w-fit group"
              >
                {dict.post.readMore}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Image Side */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm">
                <OptimizedImage
                  src={`/placeholder.svg?height=600&width=800&text=${encodeURIComponent(featuredPosts[0].title)}`}
                  alt={featuredPosts[0].title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-400/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </section>
      )}

      {/* Post em Destaque (Featured Post) */}
      {/*{featuredPosts.length > 0 && (*/}
      {/*  <section>*/}
      {/*    <h2 className="text-3xl font-bold mb-8">{dict.home.featuredPost}</h2>*/}
      {/*    <div className="grid grid-cols-1 gap-8">*/}
      {/*      <FeaturedPostCard post={featuredPosts[0]} lang={params.lang} dict={dict} />*/}
      {/*    </div>*/}
      {/*  </section>*/}
      {/*)}*/}

      {/* AdSense Banner */}
      <LazyLoad>
        <div className="my-8">
          <AdSense slot="1234567890" format="auto" style={{ display: "block" }} responsive={true} />
        </div>
      </LazyLoad>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">{dict.home.latestPosts}</h2>
            <Link href={`/${params.lang}/posts`} className="text-blue-500 flex items-center hover:underline">
              {dict.home.viewAll} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <PostCard key={post.slug} post={post} lang={params.lang} dict={dict} />
            ))}
          </div>
        </section>
      )}

      {/* All Posts if no recent posts */}
      {recentPosts.length === 0 && allPosts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">{dict.home.latestPosts}</h2>
            <Link href={`/${params.lang}/posts`} className="text-blue-500 flex items-center hover:underline">
              {dict.home.viewAll} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPosts.slice(0, 6).map((post) => (
              <PostCard key={post.slug} post={post} lang={params.lang} dict={dict} />
            ))}
          </div>
        </section>
      )}

      {/* Posts by Category */}
      {topTags.map((tag) => (
        <CategorySection key={tag} title={tag} posts={postsByCategory[tag]} lang={params.lang} dict={dict} />
      ))}

      {/* No Posts Message */}
      {allPosts.length === 0 && (
        <section className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">No posts available yet</h2>
          <p className="text-muted-foreground">Posts will be created automatically when the site loads.</p>
        </section>
      )}

      {/* AdSense Banner */}
      <LazyLoad>
        <div className="my-8">
          <AdSense slot="0987654321" format="auto" style={{ display: "block" }} responsive={true} />
        </div>
      </LazyLoad>

      {/* Newsletter Signup */}
      <NewsletterSignup lang={params.lang} dict={dict} />
    </div>
  )
}
