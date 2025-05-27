import Link from "next/link"

interface TagListProps {
  tags: string[]
  lang: string
}

export default function TagList({ tags, lang }: TagListProps) {
  if (!tags || tags.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/${lang}/tags/${encodeURIComponent(tag)}`}
          className="inline-flex items-center text-xs font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
        >
          #{tag}
        </Link>
      ))}
    </div>
  )
}
