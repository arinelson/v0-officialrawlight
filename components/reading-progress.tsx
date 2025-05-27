"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()

  // Only show on post pages
  const isPostPage = pathname.includes("/posts/") && !pathname.endsWith("/posts")

  useEffect(() => {
    if (!isPostPage) return

    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100

      setProgress(Math.min(100, Math.max(0, progress)))
    }

    window.addEventListener("scroll", updateProgress)
    updateProgress() // Initial calculation

    return () => window.removeEventListener("scroll", updateProgress)
  }, [isPostPage])

  if (!isPostPage) return null

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
      <div className="h-full bg-primary transition-all duration-150 ease-out" style={{ width: `${progress}%` }} />
    </div>
  )
}
