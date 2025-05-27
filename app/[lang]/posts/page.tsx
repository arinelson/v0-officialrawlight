import { getDictionary } from "@/lib/dictionaries"
import { getAllPosts } from "@/lib/posts"
import PostCard from "@/components/post-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang)

  return {
    title: dict.posts.title,
    description: dict.posts.description,
  }
}

export default async function PostsPage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang)
  const allPosts = await getAllPosts(params.lang)

  // Group posts by year
  const postsByYear = allPosts.reduce((acc, post) => {
    const year = new Date(post.date).getFullYear().toString()
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(post)
    return acc
  }, {})

  // Sort years in descending order
  const years = Object.keys(postsByYear).sort((a, b) => Number.parseInt(b) - Number.parseInt(a))

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{dict.posts.title}</h1>
        <p className="text-muted-foreground">{dict.posts.description}</p>
      </div>

      <Tabs defaultValue={years[0]} className="w-full">
        <TabsList className="flex flex-wrap justify-center mb-8">
          {years.map((year) => (
            <TabsTrigger key={year} value={year}>
              {year}
            </TabsTrigger>
          ))}
        </TabsList>

        {years.map((year) => (
          <TabsContent key={year} value={year} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {postsByYear[year].map((post) => (
                <PostCard key={post.slug} post={post} lang={params.lang} dict={dict} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
