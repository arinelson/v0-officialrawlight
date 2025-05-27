"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useDictionary } from "@/hooks/use-dictionary"
import PostCard from "@/components/post-card"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  readingTime: number
}

export default function SearchPage({ params }: { params: { lang: string } }) {
  const dict = useDictionary(params.lang)
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [posts, setPosts] = useState<Post[]>([])
  const [results, setResults] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`/api/${params.lang}/posts`)
        const data = await response.json()
        setPosts(data)
        setIsLoading(false)

        if (initialQuery) {
          searchPosts(initialQuery, data)
        }
      } catch (error) {
        console.error("Error fetching posts:", error)
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [params.lang, initialQuery])

  function searchPosts(searchQuery: string, postList = posts) {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    const lowerCaseQuery = searchQuery.toLowerCase()
    const filtered = postList.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerCaseQuery) ||
        post.excerpt.toLowerCase().includes(lowerCaseQuery) ||
        post.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery)),
    )

    setResults(filtered)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    searchPosts(query)

    // Update URL with search query
    const url = new URL(window.location.href)
    url.searchParams.set("q", query)
    window.history.pushState({}, "", url.toString())
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{dict?.search?.title || "Search"}</h1>
        <p className="text-muted-foreground">{dict?.search?.description || "Find posts by title, content, or tags"}</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
        <Input
          type="search"
          placeholder={dict?.search?.placeholder || "Search posts..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          {dict?.search?.button || "Search"}
        </Button>
      </form>

      {isLoading ? (
        <div className="text-center py-8">{dict?.search?.loading || "Loading..."}</div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((post) => (
            <PostCard key={post.slug} post={post} lang={params.lang} dict={dict || {}} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-8">{dict?.search?.noResults || "No posts found matching your search."}</div>
      ) : null}
    </div>
  )
}
