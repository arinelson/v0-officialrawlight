"use client"

import { useState, useEffect } from "react"
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
      const scrollPercent = (scrollTop / docHeight) * 100

      setProgress(Math.min(100, Math.max(0, scrollPercent)))
    }

    // Initial calculation
    updateProgress()

    // Add scroll listener
    window.addEventListener("scroll", updateProgress, { passive: true })

    // Cleanup
    return () => window.removeEventListener("scroll", updateProgress)
  }, [isPostPage])

  // Don't render if not on a post page
  if (!isPostPage) return null

  return (
    <>
      {/* Fixed progress bar at top */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Circular progress indicator (optional, shows on scroll) */}
      {progress > 5 && (
        <div className="fixed bottom-8 right-8 z-40">
          <div className="relative w-12 h-12">
            {/* Background circle */}
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-300 dark:text-gray-700"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Progress circle */}
              <path
                className="text-blue-500"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                fill="transparent"
                strokeDasharray={`${progress}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
