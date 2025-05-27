"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function CountryDetector() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Check if user manually selected a language
    const hasManualSelection = document.cookie.includes("preferred-language=")

    if (!hasManualSelection) {
      // Let the middleware handle the detection
      return
    }
  }, [router, pathname])

  return null
}
