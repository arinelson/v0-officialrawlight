"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"

interface LazyLoadProps {
  children: React.ReactNode
  threshold?: number
  rootMargin?: string
  placeholder?: React.ReactNode
}

export default function LazyLoad({
  children,
  threshold = 0.1,
  rootMargin = "0px",
  placeholder = <div className="w-full h-40 bg-gray-200 animate-pulse rounded-md" />,
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin,
      },
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, rootMargin])

  return <div ref={ref}>{isVisible ? children : placeholder}</div>
}
