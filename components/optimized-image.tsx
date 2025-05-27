"use client"

import { useState } from "react"
import Image from "next/image"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  className?: string
  sizes?: string
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className = "",
  sizes = "100vw",
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className={`relative ${fill ? "w-full h-full" : ""} overflow-hidden`}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        fill={fill}
        priority={priority}
        sizes={sizes}
        className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"} ${className}`}
        onLoad={() => setIsLoaded(true)}
        loading={priority ? "eager" : "lazy"}
      />
      {!isLoaded && (
        <div
          className={`absolute inset-0 bg-gray-200 animate-pulse ${fill ? "w-full h-full" : ""}`}
          style={{ width: !fill ? width : "100%", height: !fill ? height : "100%" }}
        />
      )}
    </div>
  )
}
